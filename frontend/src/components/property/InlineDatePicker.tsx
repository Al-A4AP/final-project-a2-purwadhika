import type { FC, ReactNode } from 'react';
import { CalendarIcon } from 'lucide-react';
import { DateErrorNotice } from './pricing-calendar/DateErrorNotice';
import { NightsNotice } from './pricing-calendar/NightsNotice';
import { SelectedDateFields } from './pricing-calendar/SelectedDateFields';
import { getNights } from '@/hooks/pricing-calendar/dateUtils';

interface InlineDatePickerProps {
  checkIn: string;
  checkOut: string;
  dateError: string;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
}

/** Inline date picker section — always visible, positioned after room selection. */
export const InlineDatePicker: FC<InlineDatePickerProps> = (props) => {
  const nights = getNights(props.checkIn, props.checkOut);
  return (
    <SectionCard id="date-picker-section">
      <SectionHeader />
      <SelectedDateFields
        checkIn={props.checkIn}
        checkOut={props.checkOut}
        onCheckInChange={props.onCheckInChange}
        onCheckOutChange={props.onCheckOutChange}
      />
      <DateErrorNotice message={props.dateError} />
      <NightsNotice nights={nights} />
    </SectionCard>
  );
};

const SectionCard: FC<{ id: string; children: ReactNode }> = ({ id, children }) => (
  <div id={id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border dark:border-slate-700 mb-8">
    {children}
  </div>
);

const SectionHeader: FC = () => (
  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
    <CalendarIcon size={20} className="text-red-600" />
    Pilih Tanggal Menginap
  </h2>
);
