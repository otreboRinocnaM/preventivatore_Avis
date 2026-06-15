import React from 'react';
import { Car } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-avis-dark text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
        <div className="bg-avis-medium p-2 rounded-lg">
          <Car size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold leading-tight tracking-tight">
            Autonoleggi Demontis
          </h1>
          <p className="text-sm text-blue-200 font-medium">
            AVIS Sardegna — Preventivatore Alta Stagione 2026
          </p>
        </div>
        <div className="ml-auto hidden sm:block text-right">
          <span className="inline-block bg-avis-medium px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
            15 Giu – 31 Ago 2026
          </span>
        </div>
      </div>
    </header>
  );
}
