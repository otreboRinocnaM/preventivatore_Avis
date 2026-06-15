import React from 'react';
import { User, AlertTriangle, Info, Baby } from 'lucide-react';

export default function DriverInfo({ eta, bambini, onEtaChange, onBambiniChange, errors }) {
  const etaNum = parseInt(eta, 10);
  const isUnder21 = !isNaN(etaNum) && etaNum < 21 && etaNum >= 18;
  const isYoungDriver = !isNaN(etaNum) && etaNum >= 21 && etaNum <= 25;
  const bambiniNum = parseInt(bambini, 10) || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-avis-dark p-1.5 rounded-md">
          <User size={18} className="text-white" />
        </div>
        <h2 className="text-lg font-semibold text-avis-dark">Informazioni Conducente</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Driver age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Età conducente <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={18}
            max={99}
            value={eta}
            onChange={(e) => onEtaChange(e.target.value)}
            placeholder="es. 30"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-avis-medium transition-colors ${
              errors?.eta
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:border-avis-medium'
            }`}
          />
          {errors?.eta && (
            <p className="text-red-500 text-xs mt-1">{errors.eta}</p>
          )}

          {isUnder21 && (
            <div className="mt-2 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-700">
                Noleggio potrebbe non essere disponibile sotto i 21 anni
              </p>
            </div>
          )}
          {isYoungDriver && (
            <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700">
                Verrà applicata la Young Driver Fee
              </p>
            </div>
          )}
        </div>

        {/* Children count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bambini sotto i 5 anni
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onBambiniChange(Math.max(0, bambiniNum - 1))}
              className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-avis-medium transition-colors"
              disabled={bambiniNum <= 0}
            >
              −
            </button>
            <div className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 min-w-[60px] justify-center">
              <Baby size={14} className="text-avis-dark" />
              <span className="text-sm font-semibold text-avis-dark">{bambiniNum}</span>
            </div>
            <button
              type="button"
              onClick={() => onBambiniChange(Math.min(3, bambiniNum + 1))}
              className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-avis-medium transition-colors"
              disabled={bambiniNum >= 3}
            >
              +
            </button>
          </div>

          {bambiniNum > 0 && (
            <div className="mt-2 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700">
                Seggiolino obbligatorio per bambini fino a 5 anni
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
