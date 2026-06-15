import { modelli, servizi } from '../data/rates.js';

/**
 * Calculate number of days between two dates (end - start).
 * Returns 0 if dates are invalid or end <= start.
 */
export function calcolaGiorni(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.round((endDate.getTime() - startDate.getTime()) / msPerDay);
  return diff > 0 ? diff : 0;
}

/**
 * Calculate base rental price for a given car model and number of days.
 * Returns 0 if days <= 0 or model not found.
 */
export function calcolaPrezzoBase(modelloId, giorni) {
  if (!modelloId || giorni <= 0) return 0;
  const modello = modelli.find((m) => m.id === modelloId);
  if (!modello) return 0;

  if (giorni <= 7) {
    return modello.prezzi[giorni - 1];
  }
  return modello.prezzi[6] + (giorni - 7) * modello.extraGiorno;
}

/**
 * Calculate full quote breakdown.
 * form = {
 *   modelloId, startDate, endDate,
 *   eta, bambini,
 *   oneWay, fuelRefueling, hotelDelivery, hotelImporto,
 *   adminFee,
 *   seggiolini, seggioliniDanneggiati,
 *   youngDriver,
 * }
 * Returns an object with all cost lines and total.
 */
export function calcolaPreventivo(form, giorni) {
  const result = {
    prezzoBase: 0,
    oneWay: 0,
    fuelRefueling: 0,
    hotelDelivery: 0,
    youngDriver: 0,
    seggiolini: 0,
    adminFee: 0,
    totale: 0,
    giorni,
    youngDriverGiorni: 0,
    seggioliniCount: 0,
    seggioliniGiorni: 0,
    seggioliniDanneggiati: false,
  };

  if (!form.modelloId || giorni <= 0) return result;

  result.prezzoBase = calcolaPrezzoBase(form.modelloId, giorni);

  if (form.oneWay) {
    result.oneWay = servizi.oneWay;
  }

  if (form.fuelRefueling) {
    result.fuelRefueling = servizi.fuelRefueling;
  }

  if (form.hotelDelivery && form.hotelImporto) {
    const parsed = parseFloat(String(form.hotelImporto).replace(',', '.'));
    result.hotelDelivery = isNaN(parsed) ? 0 : parsed;
  }

  if (form.adminFee) {
    result.adminFee = servizi.adminFee;
  }

  // Young driver: only for ages 21-25
  const eta = parseInt(form.eta, 10);
  if (form.youngDriver && eta >= 21 && eta <= 25) {
    const youngGiorni = Math.min(giorni, 15);
    result.youngDriverGiorni = youngGiorni;
    result.youngDriver = youngGiorni * servizi.youngDriverGiorno * (1 + servizi.IVA);
  }

  // Child seats
  const numSeggiolini = parseInt(form.seggiolini, 10) || 0;
  if (numSeggiolini > 0) {
    result.seggioliniCount = numSeggiolini;
    result.seggioliniDanneggiati = form.seggioliniDanneggiati;
    if (form.seggioliniDanneggiati) {
      result.seggiolini = numSeggiolini * servizi.childSeatDanno * (1 + servizi.IVA);
      result.seggioliniGiorni = 0;
    } else {
      const seatGiorni = Math.min(giorni, 3);
      result.seggioliniGiorni = seatGiorni;
      result.seggiolini = numSeggiolini * seatGiorni * servizi.childSeatGiorno * (1 + servizi.IVA);
    }
  }

  result.totale =
    result.prezzoBase +
    result.oneWay +
    result.fuelRefueling +
    result.hotelDelivery +
    result.youngDriver +
    result.seggiolini +
    result.adminFee;

  return result;
}

/**
 * Format a number as Italian currency string (e.g., € 1.234,50)
 */
export function formatEuro(value) {
  return `€ ${value.toFixed(2).replace('.', ',')}`;
}
