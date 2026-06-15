import React from 'react';
import { FileText, Copy, RotateCcw, ExternalLink, Check, Calendar, Car, Euro } from 'lucide-react';
import { modelli, inclusi } from '../data/rates.js';
import { formatEuro } from '../utils/calculations.js';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

function SummaryRow({ label, value, highlight }) {
  if (!value) return null;
  return (
    <div className={`flex justify-between items-baseline gap-2 py-1 ${highlight ? 'font-semibold' : ''}`}>
      <span className={`text-xs ${highlight ? 'text-gray-700' : 'text-gray-500'}`}>{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-avis-dark' : 'text-gray-800'} whitespace-nowrap`}>
        {value}
      </span>
    </div>
  );
}

function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return '—';
  const s = format(startDate, 'dd/MM', { locale: it });
  const e = format(endDate, 'dd/MM/yyyy', { locale: it });
  return `${s} – ${e}`;
}

export default function QuoteSummary({
  form,
  giorni,
  preventivo,
  onCopy,
  onPDF,
  onReset,
}) {
  const modello = modelli.find((m) => m.id === form.modelloId);
  const hasQuote = preventivo.prezzoBase > 0;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 sticky top-4">
      {/* Header */}
      <div className="bg-avis-dark text-white px-5 py-4 rounded-t-xl">
        <div className="flex items-center gap-2 mb-1">
          <FileText size={16} />
          <h3 className="font-bold text-base tracking-wide uppercase">Preventivo Avis Sardegna</h3>
        </div>
        <p className="text-blue-200 text-xs">Alta Stagione: 15/06 – 31/08/2026</p>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Vehicle info */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Car size={13} className="text-avis-medium" />
            <span className="text-xs font-semibold text-avis-medium uppercase tracking-wide">Veicolo</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {modello ? modello.nome : <span className="text-gray-400 italic">Seleziona un veicolo…</span>}
          </p>
          {modello && (
            <p className="text-xs text-gray-500 mt-0.5">{modello.categoria}</p>
          )}
        </div>

        {/* Period */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Calendar size={13} className="text-avis-medium" />
            <span className="text-xs font-semibold text-avis-medium uppercase tracking-wide">Periodo</span>
          </div>
          <p className="text-sm text-gray-800">
            {form.startDate && form.endDate
              ? formatDateRange(form.startDate, form.endDate)
              : <span className="text-gray-400 italic">Seleziona le date…</span>}
          </p>
          {giorni > 0 && (
            <p className="text-xs text-gray-500 mt-0.5">{giorni} giorn{giorni === 1 ? 'o' : 'i'}</p>
          )}
        </div>

        {/* Cost breakdown */}
        {hasQuote && (
          <>
            <div className="border-t border-gray-100 pt-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Euro size={13} className="text-avis-medium" />
                <span className="text-xs font-semibold text-avis-medium uppercase tracking-wide">Calcolo</span>
              </div>
              <div className="space-y-0.5">
                <SummaryRow
                  label={`Noleggio base (${giorni} giorni)`}
                  value={formatEuro(preventivo.prezzoBase)}
                />

                {preventivo.oneWay > 0 && (
                  <SummaryRow label="One-way rental" value={formatEuro(preventivo.oneWay)} />
                )}
                {preventivo.fuelRefueling > 0 && (
                  <SummaryRow label="Servizio carburante" value={formatEuro(preventivo.fuelRefueling)} />
                )}
                {preventivo.hotelDelivery > 0 && (
                  <SummaryRow label="Consegna/ritiro hotel" value={formatEuro(preventivo.hotelDelivery)} />
                )}
                {preventivo.youngDriver > 0 && (
                  <SummaryRow
                    label={`Young Driver (${preventivo.youngDriverGiorni}g)`}
                    value={formatEuro(preventivo.youngDriver)}
                  />
                )}
                {preventivo.seggiolini > 0 && (
                  <SummaryRow
                    label={
                      preventivo.seggioliniDanneggiati
                        ? `Seggiolino danneggiato (${preventivo.seggioliniCount} un.)`
                        : `Seggiolino (${preventivo.seggioliniGiorni}g × ${preventivo.seggioliniCount})`
                    }
                    value={formatEuro(preventivo.seggiolini)}
                  />
                )}
                {preventivo.adminFee > 0 && (
                  <SummaryRow label="Administration Fee" value={formatEuro(preventivo.adminFee)} />
                )}
              </div>
            </div>

            {/* Inclusions */}
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs font-semibold text-avis-medium uppercase tracking-wide mb-2">
                Incluso nel prezzo
              </p>
              <ul className="space-y-1">
                {inclusi.map((item) => (
                  <li key={item} className="flex items-start gap-1.5">
                    <Check size={10} className="text-green-500 mt-0.5 shrink-0" />
                    <span className="text-xs text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {!hasQuote && (
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs text-gray-400 italic text-center py-2">
              Seleziona veicolo e date per vedere il preventivo
            </p>
          </div>
        )}

        {/* Total */}
        <div className="border-t-2 border-avis-dark pt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-avis-dark uppercase tracking-wide">Totale</span>
            <span className={`text-xl font-bold ${hasQuote ? 'text-avis-dark' : 'text-gray-300'}`}>
              {hasQuote ? formatEuro(preventivo.totale) : '—'}
            </span>
          </div>
          {hasQuote && (
            <p className="text-xs text-gray-400 mt-0.5">Prezzi IVA inclusa dove applicabile</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onCopy}
            disabled={!hasQuote}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-avis-light-bg text-avis-dark text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-avis-medium"
            title="Copia preventivo negli appunti"
          >
            <Copy size={13} />
            Copia
          </button>
          <button
            type="button"
            onClick={onPDF}
            disabled={!hasQuote}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-avis-medium text-white text-xs font-semibold rounded-lg hover:bg-avis-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-avis-medium"
            title="Scarica PDF"
          >
            <FileText size={13} />
            PDF
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            title="Resetta il modulo"
          >
            <RotateCcw size={13} />
            Resetta
          </button>
          <a
            href="#prenota"
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            title="Procedi alla prenotazione"
          >
            <ExternalLink size={13} />
            Prenota
          </a>
        </div>
      </div>
    </div>
  );
}
