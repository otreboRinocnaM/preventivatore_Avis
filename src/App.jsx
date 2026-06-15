import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header.jsx';
import CarSelector from './components/CarSelector.jsx';
import DateSelector from './components/DateSelector.jsx';
import DriverInfo from './components/DriverInfo.jsx';
import AdditionalServices from './components/AdditionalServices.jsx';
import QuoteSummary from './components/QuoteSummary.jsx';
import { calcolaGiorni, calcolaPrezzoBase, calcolaPreventivo } from './utils/calculations.js';
import { copiaPreventivo, generaPDF } from './utils/export.js';

// ─── Toast ───────────────────────────────────────────────────────────────────

const TOAST_TYPES = {
  success: {
    bg: 'bg-green-600',
    border: 'border-green-700',
    icon: '✓',
  },
  warning: {
    bg: 'bg-amber-500',
    border: 'border-amber-600',
    icon: '⚠',
  },
  info: {
    bg: 'bg-blue-600',
    border: 'border-blue-700',
    icon: 'ℹ',
  },
  error: {
    bg: 'bg-red-600',
    border: 'border-red-700',
    icon: '✕',
  },
};

function Toast({ toasts }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const style = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border text-white text-sm font-medium max-w-xs pointer-events-auto animate-fade-in ${style.bg} ${style.border}`}
          >
            <span className="text-base leading-none">{style.icon}</span>
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Initial form state ───────────────────────────────────────────────────────

const INITIAL_FORM = {
  modelloId: null,
  startDate: null,
  endDate: null,
  eta: '',
  bambini: 0,
  // Additional services
  oneWay: false,
  fuelRefueling: false,
  hotelDelivery: false,
  hotelImporto: '',
  adminFee: false,
  // Family
  seggiolini: 0,
  seggioliniDanneggiati: false,
  // Young driver
  youngDriver: false,
};

const EMPTY_PREVENTIVO = {
  prezzoBase: 0,
  oneWay: 0,
  fuelRefueling: 0,
  hotelDelivery: 0,
  youngDriver: 0,
  seggiolini: 0,
  adminFee: 0,
  totale: 0,
  giorni: 0,
  youngDriverGiorni: 0,
  seggioliniCount: 0,
  seggioliniGiorni: 0,
  seggioliniDanneggiati: false,
};

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [toasts, setToasts] = useState([]);

  // Derived values
  const giorni = calcolaGiorni(form.startDate, form.endDate);
  const prezzoBase = calcolaPrezzoBase(form.modelloId, giorni);

  // Auto-toggle youngDriver when age enters/leaves range
  useEffect(() => {
    const etaNum = parseInt(form.eta, 10);
    const isEligible = !isNaN(etaNum) && etaNum >= 21 && etaNum <= 25;
    if (isEligible && !form.youngDriver) {
      setForm((prev) => ({ ...prev, youngDriver: true }));
    } else if (!isEligible && form.youngDriver) {
      setForm((prev) => ({ ...prev, youngDriver: false }));
    }
  }, [form.eta]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset seggiolini if bambini decreases
  useEffect(() => {
    const b = parseInt(form.bambini, 10) || 0;
    const s = parseInt(form.seggiolini, 10) || 0;
    if (s > b) {
      setForm((prev) => ({ ...prev, seggiolini: b }));
    }
  }, [form.bambini]); // eslint-disable-line react-hooks/exhaustive-deps

  const preventivo = calcolaPreventivo(form, giorni);

  // ── Toast helpers ──
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // ── Form field updater ──
  const handleFormChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // ── Validation ──
  const validate = useCallback(() => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!form.modelloId) {
      newErrors.modelloId = 'Seleziona un veicolo';
    }
    if (!form.startDate) {
      newErrors.startDate = 'Seleziona la data di ritiro';
    } else {
      const s = new Date(form.startDate);
      s.setHours(0, 0, 0, 0);
      if (s < today) {
        newErrors.startDate = 'La data di ritiro non può essere nel passato';
      }
    }
    if (!form.endDate) {
      newErrors.endDate = 'Seleziona la data di riconsegna';
    } else if (form.startDate && form.endDate <= form.startDate) {
      newErrors.endDate = 'La data di riconsegna deve essere successiva al ritiro';
    }
    if (!form.eta) {
      newErrors.eta = 'Inserisci l\'età del conducente';
    } else {
      const eta = parseInt(form.eta, 10);
      if (isNaN(eta) || eta < 18 || eta > 99) {
        newErrors.eta = 'L\'età deve essere compresa tra 18 e 99 anni';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  // ── Actions ──
  const handleCopy = useCallback(async () => {
    if (!validate()) {
      addToast('Completa tutti i campi obbligatori prima di copiare', 'error');
      return;
    }
    try {
      await copiaPreventivo(form, giorni, preventivo);
      addToast('Preventivo copiato negli appunti!', 'success');
    } catch {
      addToast('Errore durante la copia. Riprova.', 'error');
    }
  }, [form, giorni, preventivo, validate, addToast]);

  const handlePDF = useCallback(() => {
    if (!validate()) {
      addToast('Completa tutti i campi obbligatori prima di generare il PDF', 'error');
      return;
    }
    try {
      generaPDF(form, giorni, preventivo);
      addToast('PDF generato e scaricato!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Errore durante la generazione del PDF', 'error');
    }
  }, [form, giorni, preventivo, validate, addToast]);

  const handleReset = useCallback(() => {
    setForm(INITIAL_FORM);
    setErrors({});
    addToast('Preventivo resettato', 'info');
  }, [addToast]);

  return (
    <div className="min-h-screen bg-avis-light-bg">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Left column: form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Section 1: Car */}
            <CarSelector
              modelloId={form.modelloId}
              onChange={(val) => handleFormChange('modelloId', val)}
              error={errors.modelloId}
            />

            {/* Section 2: Dates */}
            <DateSelector
              startDate={form.startDate}
              endDate={form.endDate}
              onStartChange={(date) => handleFormChange('startDate', date)}
              onEndChange={(date) => handleFormChange('endDate', date)}
              giorni={giorni}
              prezzoBase={prezzoBase}
              errors={errors}
            />

            {/* Section 3: Driver */}
            <DriverInfo
              eta={form.eta}
              bambini={form.bambini}
              onEtaChange={(val) => handleFormChange('eta', val)}
              onBambiniChange={(val) => handleFormChange('bambini', val)}
              errors={errors}
            />

            {/* Section 4: Additional services */}
            <AdditionalServices
              form={form}
              onChange={handleFormChange}
              bambini={form.bambini}
              eta={form.eta}
              giorni={giorni}
            />

            {/* Mobile summary (below form on small screens) */}
            <div className="lg:hidden">
              <QuoteSummary
                form={form}
                giorni={giorni}
                preventivo={preventivo}
                onCopy={handleCopy}
                onPDF={handlePDF}
                onReset={handleReset}
              />
            </div>
          </div>

          {/* Right column: sticky summary (desktop only) */}
          <div className="hidden lg:block lg:col-span-1">
            <QuoteSummary
              form={form}
              giorni={giorni}
              preventivo={preventivo}
              onCopy={handleCopy}
              onPDF={handlePDF}
              onReset={handleReset}
            />
          </div>
        </div>
      </main>

      {/* Toasts */}
      <Toast toasts={toasts} />
    </div>
  );
}
