import { jsPDF } from 'jspdf';
import { modelli } from '../data/rates.js';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

function formatEuroText(value) {
  return `€ ${value.toFixed(2).replace('.', ',')}`;
}

function formatDateIT(date) {
  if (!date) return '—';
  return format(date, 'dd/MM/yyyy', { locale: it });
}

function buildTextLines(form, giorni, preventivo) {
  const modello = modelli.find((m) => m.id === form.modelloId);
  const lines = [];

  lines.push('AUTONOLEGGI DEMONTIS - AVIS SARDEGNA');
  lines.push('Preventivo Noleggio Auto - Alta Stagione 2026');
  lines.push('Periodo Alta Stagione: 15/06/2026 - 31/08/2026');
  lines.push('');
  lines.push('────────────────────────────────────────');
  lines.push('VEICOLO E PERIODO');
  lines.push('────────────────────────────────────────');
  lines.push(`Auto: ${modello ? modello.nome : '—'}`);
  lines.push(`Categoria: ${modello ? modello.categoria : '—'}`);
  lines.push(`Ritiro: ${formatDateIT(form.startDate)}`);
  lines.push(`Riconsegna: ${formatDateIT(form.endDate)}`);
  lines.push(`Durata: ${giorni} giorn${giorni === 1 ? 'o' : 'i'}`);
  lines.push('');
  lines.push('────────────────────────────────────────');
  lines.push('CALCOLO PREVENTIVO');
  lines.push('────────────────────────────────────────');
  lines.push(`Noleggio base (${giorni} giorni): ${formatEuroText(preventivo.prezzoBase)}`);

  if (preventivo.oneWay > 0) {
    lines.push(`One-way Rental: ${formatEuroText(preventivo.oneWay)} (IVA incl.)`);
  }
  if (preventivo.fuelRefueling > 0) {
    lines.push(`Servizio Carburante: ${formatEuroText(preventivo.fuelRefueling)} (IVA incl.)`);
  }
  if (preventivo.hotelDelivery > 0) {
    lines.push(`Consegna/Ritiro Hotel: ${formatEuroText(preventivo.hotelDelivery)}`);
  }
  if (preventivo.youngDriver > 0) {
    lines.push(`Young Driver Fee (${preventivo.youngDriverGiorni} giorni): ${formatEuroText(preventivo.youngDriver)} (IVA incl.)`);
  }
  if (preventivo.seggiolini > 0) {
    if (preventivo.seggioliniDanneggiati) {
      lines.push(`Seggiolino Danneggiato (${preventivo.seggioliniCount} un.): ${formatEuroText(preventivo.seggiolini)} (IVA incl.)`);
    } else {
      lines.push(`Seggiolino (${preventivo.seggioliniCount} un. × ${preventivo.seggioliniGiorni} giorni): ${formatEuroText(preventivo.seggiolini)} (IVA incl.)`);
    }
  }
  if (preventivo.adminFee > 0) {
    lines.push(`Administration Fee: ${formatEuroText(preventivo.adminFee)} (IVA incl.)`);
  }

  lines.push('');
  lines.push('────────────────────────────────────────');
  lines.push(`TOTALE: ${formatEuroText(preventivo.totale)}`);
  lines.push('────────────────────────────────────────');
  lines.push('');
  lines.push('INCLUSO NEL PREZZO:');
  lines.push('✓ Chilometraggio illimitato');
  lines.push('✓ SCDW - Copertura danni per collisione');
  lines.push('✓ STP - Protezione contro il furto');
  lines.push('✓ Railway Surcharge 14%');
  lines.push('✓ Airport Surcharge 20%');
  lines.push('✓ Tassa stradale');
  lines.push('✓ Grace period 29 minuti');
  lines.push('✓ Assistenza 24/7');
  lines.push('✓ Protezione parabrezza');
  lines.push('');
  lines.push('Per prenotazioni: www.avissardegna.it');
  lines.push(`Preventivo generato il ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: it })}`);

  return lines;
}

export function copiaPreventivo(form, giorni, preventivo) {
  const lines = buildTextLines(form, giorni, preventivo);
  const text = lines.join('\n');
  return navigator.clipboard.writeText(text);
}

export function generaPDF(form, giorni, preventivo) {
  const modello = modelli.find((m) => m.id === form.modelloId);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentW = pageW - margin * 2;

  // Header background
  doc.setFillColor(30, 58, 95); // #1e3a5f
  doc.rect(0, 0, pageW, 40, 'F');

  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('AUTONOLEGGI DEMONTIS', margin, 16);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.text('AVIS SARDEGNA', margin, 24);
  doc.setFontSize(9);
  doc.text('Alta Stagione 2026 — 15 Giugno - 31 Agosto', margin, 33);

  // Accent bar
  doc.setFillColor(45, 95, 158); // #2d5f9e
  doc.rect(0, 40, pageW, 3, 'F');

  let y = 52;
  doc.setTextColor(30, 58, 95);

  // Section: Vehicle & Period
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(240, 244, 248);
  doc.rect(margin, y - 5, contentW, 8, 'F');
  doc.text('VEICOLO E PERIODO', margin + 2, y + 0.5);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);

  const fields = [
    ['Auto', modello ? modello.nome : '—'],
    ['Categoria', modello ? modello.categoria : '—'],
    ['Data Ritiro', formatDateIT(form.startDate)],
    ['Data Riconsegna', formatDateIT(form.endDate)],
    ['Durata', `${giorni} giorn${giorni === 1 ? 'o' : 'i'}`],
  ];

  fields.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 95);
    doc.text(`${label}:`, margin + 2, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text(value, margin + 45, y);
    y += 7;
  });

  y += 5;

  // Section: Cost Breakdown
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 95);
  doc.setFillColor(240, 244, 248);
  doc.rect(margin, y - 5, contentW, 8, 'F');
  doc.text('CALCOLO PREVENTIVO', margin + 2, y + 0.5);
  y += 10;

  doc.setFontSize(10);

  const rows = [
    [`Noleggio base (${giorni} giorni)`, formatEuroText(preventivo.prezzoBase)],
  ];

  if (preventivo.oneWay > 0) rows.push(['One-way Rental (IVA incl.)', formatEuroText(preventivo.oneWay)]);
  if (preventivo.fuelRefueling > 0) rows.push(['Servizio Carburante (IVA incl.)', formatEuroText(preventivo.fuelRefueling)]);
  if (preventivo.hotelDelivery > 0) rows.push(['Consegna/Ritiro Hotel', formatEuroText(preventivo.hotelDelivery)]);
  if (preventivo.youngDriver > 0) rows.push([`Young Driver Fee (${preventivo.youngDriverGiorni} giorni, IVA incl.)`, formatEuroText(preventivo.youngDriver)]);
  if (preventivo.seggiolini > 0) {
    const seatLabel = preventivo.seggioliniDanneggiati
      ? `Seggiolino Danneggiato (${preventivo.seggioliniCount} un., IVA incl.)`
      : `Seggiolino (${preventivo.seggioliniCount} un. × ${preventivo.seggioliniGiorni} gg, IVA incl.)`;
    rows.push([seatLabel, formatEuroText(preventivo.seggiolini)]);
  }
  if (preventivo.adminFee > 0) rows.push(['Administration Fee (IVA incl.)', formatEuroText(preventivo.adminFee)]);

  rows.forEach(([label, value], idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 4, contentW, 7, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text(label, margin + 2, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 95);
    doc.text(value, pageW - margin - 2, y, { align: 'right' });
    y += 7;
  });

  // Separator line
  y += 3;
  doc.setDrawColor(45, 95, 158);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 7;

  // Total
  doc.setFillColor(30, 58, 95);
  doc.rect(margin, y - 5, contentW, 11, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTALE', margin + 4, y + 2);
  doc.text(formatEuroText(preventivo.totale), pageW - margin - 4, y + 2, { align: 'right' });
  y += 18;

  // Section: Inclusions
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 95);
  doc.setFillColor(240, 244, 248);
  doc.rect(margin, y - 5, contentW, 8, 'F');
  doc.text('INCLUSO NEL PREZZO', margin + 2, y + 0.5);
  y += 10;

  const inclusions = [
    'Chilometraggio illimitato',
    'SCDW - Copertura danni per collisione',
    'STP - Protezione contro il furto',
    'Railway Surcharge 14%',
    'Airport Surcharge 20%',
    'Tassa stradale',
    'Grace period 29 minuti',
    'Assistenza 24/7',
    'Protezione parabrezza',
  ];

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);

  const colW = contentW / 2;
  inclusions.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = margin + 2 + col * colW;
    const yPos = y + row * 6.5;
    doc.setTextColor(45, 95, 158);
    doc.text('✓', xPos, yPos);
    doc.setTextColor(50, 50, 50);
    doc.text(item, xPos + 6, yPos);
  });

  const incRows = Math.ceil(inclusions.length / 2);
  y += incRows * 6.5 + 8;

  // Footer
  doc.setFillColor(30, 58, 95);
  doc.rect(0, doc.internal.pageSize.getHeight() - 20, pageW, 20, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 210, 225);
  doc.text('Autonoleggi Demontis - Concessionario Avis Sardegna', margin, doc.internal.pageSize.getHeight() - 12);
  doc.text(
    `Preventivo generato il ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: it })}`,
    pageW - margin,
    doc.internal.pageSize.getHeight() - 12,
    { align: 'right' }
  );
  doc.text('I prezzi si riferiscono all\'Alta Stagione 2026. Soggetti a disponibilità.', margin, doc.internal.pageSize.getHeight() - 6);

  const filename = `Preventivo_Avis_${modello ? modello.id : 'XX'}_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`;
  doc.save(filename);
}
