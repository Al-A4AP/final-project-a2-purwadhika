import type { FC, ReactNode } from 'react';
import { CalendarDays } from 'lucide-react';
import type { Room } from '@/types';
import { usePricingCalendar } from '@/hooks/usePricingCalendar';
import { PricingCalendarLegend } from './pricing-calendar/PricingCalendarLegend';
import { PricingCalendarPicker } from './pricing-calendar/PricingCalendarPicker';

interface InlineAvailabilitySectionProps {
  room: Room | null;
  checkIn: string;
  checkOut: string;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
}

/**
 * Displays only the pricing calendar grid inline on the property detail page.
 * Date input fields are handled by InlineDatePicker above this section.
 * Shows a placeholder when no room is selected.
 */
export const InlineAvailabilitySection: FC<InlineAvailabilitySectionProps> = (props) => {
  const calendar = usePricingCalendar(
    props.room,
    props.checkIn,
    props.checkOut,
    props.onCheckInChange,
    props.onCheckOutChange,
  );

  return (
    <SectionCard id="availability-date-picker-section">
      <SectionHeader room={props.room} />
      {props.room
        ? <>
            <PricingCalendarLegend />
            <PricingCalendarPicker calendar={calendar} />
          </>
        : <NoRoomSelectedPlaceholder />
      }
    </SectionCard>
  );
};

const SectionCard: FC<{ id: string; children: ReactNode }> = ({ id, children }) => (
  <div id={id} className="bg-white/60 backdrop-blur-sm dark:bg-slate-900/60 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 mb-8">
    {children}
  </div>
);

const SectionHeader: FC<{ room: Room | null }> = ({ room }) => (
  <div className="mb-6 flex flex-col gap-1">
    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
      <CalendarDays size={20} className="text-red-600" />
      Kalender Ketersediaan Kamar
    </h2>
    {room && <p className="text-sm font-medium text-red-600 dark:text-red-400">{room.room_type}</p>}
  </div>
);

const NoRoomSelectedPlaceholder: FC = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
    <CalendarDays size={40} className="text-gray-300 dark:text-slate-600" />
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
      Pilih kamar terlebih dahulu untuk melihat kalender ketersediaan
    </p>
    <p className="text-xs text-gray-400 dark:text-slate-500">
      Klik salah satu kamar di atas, lalu pilih tanggal di kalender ini.
    </p>
  </div>
);
