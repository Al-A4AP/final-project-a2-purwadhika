import type { FC, ReactNode } from 'react';
import { CalendarIcon, AlertTriangle } from 'lucide-react';

interface Props {
  checkIn: string;
  checkOut: string;
  checkInUTC: string;
  dateError: string;
  onCheckInChange: (val: string) => void;
  onCheckOutChange: (val: string) => void;
}

export const DatePickerSection: FC<Props> = (props) => (
  <DatePickerCard>
    <DatePickerHeader />
    <DateInputGrid props={props} todayStr={getTodayString()} />
    <DateErrorMessage dateError={props.dateError} />
    <SelectedNights nights={getSelectedNights(props.checkIn, props.checkOut)} />
  </DatePickerCard>
);

const DatePickerCard: FC<{ children: ReactNode }> = ({ children }) => (
  <div id="date-picker-section" className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border dark:border-slate-700 mb-8">
    {children}
  </div>
);

const DateInputGrid: FC<{ props: Props; todayStr: string }> = ({ props, todayStr }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <DateInput label="Check-in" value={props.checkIn} min={todayStr} onChange={props.onCheckInChange} />
    <DateInput label="Check-out" value={props.checkOut} min={props.checkInUTC || todayStr} onChange={props.onCheckOutChange} />
  </div>
);

const DatePickerHeader = () => (
  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
    <CalendarIcon size={20} className="text-red-600" /> Pilih Tanggal Menginap
  </h2>
);

const DateInput: FC<DateInputProps> = ({ label, value, min, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <input type="date" value={value} min={min} onChange={(e) => onChange(e.target.value)} className={dateInputClass} />
  </div>
);

const DateErrorMessage: FC<{ dateError: string }> = ({ dateError }) =>
  dateError ? (
    <p className="mt-3 text-sm text-red-500 flex items-center gap-1">
      <AlertTriangle size={16} /> {dateError}
    </p>
  ) : null;

const SelectedNights: FC<{ nights: number }> = ({ nights }) =>
  nights > 0 ? (
    <p className="mt-3 text-sm text-green-600 dark:text-green-400 font-medium">Terpilih: {nights} malam</p>
  ) : null;

const getTodayString = () =>
  new Date().toISOString().split('T')[0];

const getSelectedNights = (checkIn: string, checkOut: string) =>
  checkIn && checkOut && new Date(checkOut) > new Date(checkIn)
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
    : 0;

const dateInputClass = 'w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none';

interface DateInputProps {
  label: string;
  value: string;
  min: string;
  onChange: (value: string) => void;
}
