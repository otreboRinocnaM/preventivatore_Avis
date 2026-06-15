import React from 'react';
import { Car, ChevronDown } from 'lucide-react';
import { modelli } from '../data/rates.js';

const categoryColors = {
  'City Car': 'bg-sky-100 text-sky-800',
  'Compatta': 'bg-green-100 text-green-800',
  'Compatta Hybrid': 'bg-emerald-100 text-emerald-800',
  'SUV Compatto': 'bg-orange-100 text-orange-800',
  'SUV': 'bg-amber-100 text-amber-800',
  'SUV Premium': 'bg-purple-100 text-purple-800',
  'SUV 7 Posti': 'bg-violet-100 text-violet-800',
  'Crossover': 'bg-cyan-100 text-cyan-800',
  'Crossover Hybrid': 'bg-teal-100 text-teal-800',
  'Station Wagon': 'bg-rose-100 text-rose-800',
  'Premium': 'bg-indigo-100 text-indigo-800',
  'Minivan 9 Posti': 'bg-pink-100 text-pink-800',
};

export default function CarSelector({ modelloId, onChange, error }) {
  const selected = modelli.find((m) => m.id === modelloId);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-avis-dark p-1.5 rounded-md">
          <Car size={18} className="text-white" />
        </div>
        <h2 className="text-lg font-semibold text-avis-dark">Selezione Veicolo</h2>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Categoria e Modello <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            value={modelloId || ''}
            onChange={(e) => onChange(e.target.value || null)}
            className={`w-full appearance-none bg-white px-4 py-2.5 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-avis-medium transition-colors ${
              error
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:border-avis-medium'
            }`}
          >
            <option value="">— Seleziona un veicolo —</option>
            {modelli.map((m) => (
              <option key={m.id} value={m.id}>
                {m.categoria} — {m.nome}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

        {selected && (
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                categoryColors[selected.categoria] || 'bg-gray-100 text-gray-700'
              }`}
            >
              {selected.categoria}
            </span>
            <span className="text-sm text-gray-600 font-medium">{selected.nome}</span>
          </div>
        )}
      </div>
    </div>
  );
}
