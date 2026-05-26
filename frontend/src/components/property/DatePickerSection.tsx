import type { FC } from 'react';
import { CalendarIcon, AlertTriangle } from 'lucide-react';

interface Props {
  checkIn: string;
  checkOut: string;
  checkInUTC: string;
  dateError: string;
  onCheckInChange: (val: string) => void;
  onCheckOutChange: (val: string) => void;
}

export const DatePickerSection: FC<Props> = ({
  checkIn, checkOut, checkInUTC, dateError,
  onCheckInChange, onCheckOutChange,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const nights = checkIn && checkOut && new Date(checkOut) > new Date(checkIn)
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
    : 0;

  return (
    <div id="date-picker-section" className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border dark:border-slate-700 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <CalendarIcon size={20} className="text-red-600" /> Pilih Tanggal Menginap
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-in</label>
          <input type="date" value={checkIn} min={todayStr}
            onChange={(e) => onCheckInChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-out</label>
          <input type="date" value={checkOut} min={checkInUTC || todayStr}
            onChange={(e) => onCheckOutChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>
      </div>
      {dateError && (
        <p className="mt-3 text-sm text-red-500 flex items-center gap-1">
          <AlertTriangle size={16} /> {dateError}
        </p>
      )}
      {nights > 0 && (
        <p className="mt-3 text-sm text-green-600 dark:text-green-400 font-medium">
          Terpilih: {nights} malam
        </p>
      )}
    </div>
  );
};
