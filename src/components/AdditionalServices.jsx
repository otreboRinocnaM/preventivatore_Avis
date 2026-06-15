import React, { useState } from 'react';
import { Settings, Shield, Baby, UserCheck, Info, AlertTriangle, Check } from 'lucide-react';
import { inclusi, servizi } from '../data/rates.js';
import { formatEuro } from '../utils/calculations.js';

const TABS = [
  { id: 'ritiro', label: 'Ritiro/Riconsegna', icon: Settings },
  { id: 'protezione', label: 'Protezione', icon: Shield },
  { id: 'famiglia', label: 'Servizi Famiglia', icon: Baby },
  { id: 'giovane', label: 'Conducente Giovane', icon: UserCheck },
];

function TabButton({ tab, active, onClick }) {
  const Icon = tab.icon;
  return (
    <button
      type="button"
      onClick={() => onClick(tab.id)}
      className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap focus:outline-none ${
        active
          ? 'border-avis-medium text-avis-medium'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      <Icon size={14} />
      <span className="hidden sm:inline">{tab.label}</span>
      <span className="sm:hidden">{tab.label.split('/')[0]}</span>
    </button>
  );
}

// Tab 1: Ritiro/Riconsegna
function TabRitiro({ form, onChange }) {
  return (
    <div className="space-y-4">
      {/* One-way */}
      <label className="flex items-start gap-3 cursor-pointer">
        <div className="relative mt-0.5">
          <input
            type="checkbox"
            checked={form.oneWay}
            onChange={(e) => onChange('oneWay', e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              form.oneWay ? 'bg-avis-medium border-avis-medium' : 'border-gray-300 bg-white'
            }`}
          >
            {form.oneWay && <Check size={12} className="text-white" />}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">One-way Rental</p>
          <p className="text-xs text-gray-500">
            Ritiro e riconsegna in sedi diverse — {formatEuro(servizi.oneWay)} IVA incl.
          </p>
        </div>
      </label>

      {/* Fuel */}
      <label className="flex items-start gap-3 cursor-pointer">
        <div className="relative mt-0.5">
          <input
            type="checkbox"
            checked={form.fuelRefueling}
            onChange={(e) => onChange('fuelRefueling', e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              form.fuelRefueling ? 'bg-avis-medium border-avis-medium' : 'border-gray-300 bg-white'
            }`}
          >
            {form.fuelRefueling && <Check size={12} className="text-white" />}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">Servizio Carburante e Rifornimento</p>
          <p className="text-xs text-gray-500">
            Restituzione senza rifornimento — {formatEuro(servizi.fuelRefueling)} IVA incl.
          </p>
        </div>
      </label>

      {/* Hotel delivery */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              checked={form.hotelDelivery}
              onChange={(e) => onChange('hotelDelivery', e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                form.hotelDelivery ? 'bg-avis-medium border-avis-medium' : 'border-gray-300 bg-white'
              }`}
            >
              {form.hotelDelivery && <Check size={12} className="text-white" />}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Consegna e Ritiro in Hotel</p>
            <p className="text-xs text-gray-500">Importo variabile in base alla destinazione</p>
          </div>
        </label>

        {form.hotelDelivery && (
          <div className="mt-2 ml-8">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Importo consegna/ritiro (€)
            </label>
            <div className="relative w-36">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.hotelImporto}
                onChange={(e) => onChange('hotelImporto', e.target.value)}
                placeholder="0,00"
                className="w-full pl-7 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-avis-medium"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Tab 2: Protezione
function TabProtezione({ form, onChange }) {
  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} className="text-green-700" />
          <p className="text-sm font-semibold text-green-800">Incluso nel prezzo base</p>
        </div>
        <ul className="space-y-1.5">
          {inclusi.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check size={12} className="text-green-600 mt-0.5 shrink-0" />
              <span className="text-xs text-green-800">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Admin fee toggle */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              checked={form.adminFee}
              onChange={(e) => onChange('adminFee', e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                form.adminFee ? 'bg-amber-500 border-amber-500' : 'border-gray-300 bg-white'
              }`}
            >
              {form.adminFee && <Check size={12} className="text-white" />}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              Dichiaro danni o infrazioni al codice stradale
            </p>
            <p className="text-xs text-gray-500">
              Administration Fee — {formatEuro(servizi.adminFee)} IVA incl.
            </p>
          </div>
        </label>

        {form.adminFee && (
          <div className="mt-2 ml-8 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <AlertTriangle size={13} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">
              L'Administration Fee copre i costi di gestione amministrativa per sinistri e infrazioni.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Tab 3: Servizi Famiglia
function TabFamiglia({ form, onChange, bambini, giorni }) {
  const bambiniNum = parseInt(bambini, 10) || 0;
  const seggioliniNum = parseInt(form.seggiolini, 10) || 0;

  if (bambiniNum === 0) {
    return (
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700">
          Inserisci il numero di bambini sotto i 5 anni nella sezione "Informazioni Conducente"
          per configurare i seggiolini.
        </p>
      </div>
    );
  }

  const seatGiorni = Math.min(giorni, 3);
  const costPerSeat = form.seggioliniDanneggiati
    ? servizi.childSeatDanno * (1 + servizi.IVA)
    : seatGiorni * servizi.childSeatGiorno * (1 + servizi.IVA);
  const totalSeggiolini = seggioliniNum > 0 ? seggioliniNum * costPerSeat : 0;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Numero seggiolini (max {bambiniNum})
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange('seggiolini', Math.max(0, seggioliniNum - 1))}
            disabled={seggioliniNum <= 0}
            className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-avis-medium transition-colors disabled:opacity-40"
          >
            −
          </button>
          <div className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 min-w-[60px] justify-center">
            <Baby size={14} className="text-avis-dark" />
            <span className="text-sm font-semibold text-avis-dark">{seggioliniNum}</span>
          </div>
          <button
            type="button"
            onClick={() => onChange('seggiolini', Math.min(bambiniNum, seggioliniNum + 1))}
            disabled={seggioliniNum >= bambiniNum}
            className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-avis-medium transition-colors disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      {seggioliniNum > 0 && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stato restituzione seggiolino
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="seggioliniStato"
                  checked={!form.seggioliniDanneggiati}
                  onChange={() => onChange('seggioliniDanneggiati', false)}
                  className="text-avis-medium focus:ring-avis-medium"
                />
                <span className="text-sm text-gray-700">Restituito integro</span>
                <span className="text-xs text-gray-500">
                  ({seatGiorni} gg × {formatEuro(servizi.childSeatGiorno)} + IVA per seggiolino)
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="seggioliniStato"
                  checked={form.seggioliniDanneggiati}
                  onChange={() => onChange('seggioliniDanneggiati', true)}
                  className="text-avis-medium focus:ring-avis-medium"
                />
                <span className="text-sm text-gray-700">Danneggiato o mancante</span>
                <span className="text-xs text-gray-500">
                  ({formatEuro(servizi.childSeatDanno)} + IVA per seggiolino)
                </span>
              </label>
            </div>
          </div>

          <div className="bg-avis-light-bg rounded-lg px-4 py-3">
            <p className="text-sm text-gray-600">
              Costo seggiolini ({seggioliniNum} un.):
              <span className="ml-2 font-bold text-avis-dark">{formatEuro(totalSeggiolini)}</span>
              <span className="text-xs text-gray-500 ml-1">(IVA incl.)</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// Tab 4: Conducente Giovane
function TabGiovane({ form, onChange, eta, giorni }) {
  const etaNum = parseInt(eta, 10);
  const isEligible = !isNaN(etaNum) && etaNum >= 21 && etaNum <= 25;

  if (!isEligible) {
    return (
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700">
          La Young Driver Fee si applica ai conducenti di età compresa tra 21 e 25 anni.
          {!isNaN(etaNum) && etaNum > 25
            ? ' Il conducente inserito non rientra in questa fascia.'
            : etaNum < 21
            ? ' I conducenti sotto i 21 anni potrebbero non essere idonei al noleggio.'
            : ' Inserisci l\'età del conducente per verificare l\'applicabilità.'}
        </p>
      </div>
    );
  }

  const youngGiorni = Math.min(giorni, 15);
  const costYoung = youngGiorni * servizi.youngDriverGiorno * (1 + servizi.IVA);

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-amber-600" />
          <p className="text-sm font-medium text-amber-800">
            Conducente giovane rilevato (età {etaNum} anni)
          </p>
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <div className="relative mt-0.5">
          <input
            type="checkbox"
            checked={form.youngDriver}
            onChange={(e) => onChange('youngDriver', e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              form.youngDriver ? 'bg-avis-medium border-avis-medium' : 'border-gray-300 bg-white'
            }`}
          >
            {form.youngDriver && <Check size={12} className="text-white" />}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">Young Driver Fee</p>
          <p className="text-xs text-gray-500">
            {formatEuro(servizi.youngDriverGiorno)} + IVA/giorno · max 15 giorni
          </p>
        </div>
      </label>

      {form.youngDriver && giorni > 0 && (
        <div className="bg-avis-light-bg rounded-lg px-4 py-3">
          <p className="text-sm text-gray-600">
            Costo Young Driver ({youngGiorni} giorni):
            <span className="ml-2 font-bold text-avis-dark">{formatEuro(costYoung)}</span>
            <span className="text-xs text-gray-500 ml-1">(IVA incl.)</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default function AdditionalServices({ form, onChange, bambini, eta, giorni }) {
  const [activeTab, setActiveTab] = useState('ritiro');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-avis-dark p-1.5 rounded-md">
          <Settings size={18} className="text-white" />
        </div>
        <h2 className="text-lg font-semibold text-avis-dark">Servizi Aggiuntivi</h2>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-200 -mx-1 mb-5 overflow-x-auto">
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            active={activeTab === tab.id}
            onClick={setActiveTab}
          />
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'ritiro' && (
          <TabRitiro form={form} onChange={onChange} />
        )}
        {activeTab === 'protezione' && (
          <TabProtezione form={form} onChange={onChange} />
        )}
        {activeTab === 'famiglia' && (
          <TabFamiglia
            form={form}
            onChange={onChange}
            bambini={bambini}
            giorni={giorni}
          />
        )}
        {activeTab === 'giovane' && (
          <TabGiovane
            form={form}
            onChange={onChange}
            eta={eta}
            giorni={giorni}
          />
        )}
      </div>
    </div>
  );
}
