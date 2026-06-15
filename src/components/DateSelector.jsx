import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { it } from 'date-fns/locale';
import { CalendarDays, Clock } from 'lucide-react';
import { formatEuro } from '../utils/calculations.js';

registerLocale('it', it);

export default function DateSelector({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  giorni,
  prezzoBase,
  errors,
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minEndDate = startDate
    ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
    : new Date(today.getTime() + 24 * 60 * 60 * 1000);

  const popperModifiers = [
    { name: 'preventOverflow', options: { boundary: 'viewport', padding: 8 } },
    { name: 'flip', options: { fallbackPlacements: ['top-start', 'bottom-start'] } },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-avis-dark p-1.5 rounded-md">
          <CalendarDays size={18} className="text-white" />
        </div>
        <h2 className="text-lg font-semibold text-avis-dark">Periodo di Noleggio</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Start date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Ritiro <span className="text-red-500">*</span>
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              onStartChange(date);
              // If end date is now before start, clear it
              if (endDate && date && endDate <= date) {
                onEndChange(null);
              }
            }}
            locale="it"
            dateFormat="dd/MM/yyyy"
            minDate={today}
            placeholderText="gg/mm/aaaa"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-avis-medium transition-colors ${
              errors?.startDate
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:border-avis-medium'
            }`}
            isClearable
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            popperModifiers={popperModifiers}
            popperPlacement="bottom-start"
          />
          {errors?.startDate && (
            <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
          )}
        </div>

        {/* End date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Riconsegna <span className="text-red-500">*</span>
          </label>
          <DatePicker
            selected={endDate}
            onChange={onEndChange}
            locale="it"
            dateFormat="dd/MM/yyyy"
            minDate={minEndDate}
            placeholderText="gg/mm/aaaa"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-avis-medium transition-colors ${
              errors?.endDate
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:border-avis-medium'
            }`}
            isClearable
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            popperModifiers={popperModifiers}
            popperPlacement="bottom-start"
            disabled={!startDate}
          />
          {errors?.endDate && (
            <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
          )}
        </div>
      </div>

      {/* Duration & price preview */}
      {giorni > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-avis-light-bg px-3 py-1.5 rounded-lg">
            <Clock size={14} className="text-avis-dark" />
            <span className="text-sm font-semibold text-avis-dark">
              {giorni} giorn{giorni === 1 ? 'o' : 'i'}
            </span>
          </div>
          {prezzoBase > 0 && (
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
              <span className="text-sm text-green-700">Prezzo base:</span>
              <span className="text-sm font-bold text-green-800">{formatEuro(prezzoBase)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
