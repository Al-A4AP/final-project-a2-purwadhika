import type { FC } from 'react';
import type { PropertyDetailPageState } from '@/hooks/user/property-detail/usePropertyDetailPageState';
import type { PropertyDetail } from '@/types';
import { formatPrice } from '@/lib/formatters';
import { differenceInCalendarDays } from 'date-fns';

interface ReservationPanelProps {
  page: PropertyDetailPageState;
  property: PropertyDetail;
  isMobile?: boolean;
}

export const ReservationPanel: FC<ReservationPanelProps> = ({ page, property, isMobile }) => {
  const { selectedRoom, checkIn, checkOut, bookingBlockedReason, handleRoomBooking } = page;
  
  const duration = checkIn && checkOut ? differenceInCalendarDays(checkOut, checkIn) : 0;
  // Fallback to minPrice if no room selected, else room price
  const basePrice = selectedRoom ? selectedRoom.base_price : property.min_price;
  const estimatedTotal = duration > 0 ? basePrice * duration : 0;

  if (isMobile) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-500 line-through decoration-rose-500/50">{/* Could show peak here */}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-red-600">{formatPrice(basePrice)}</span>
            <span className="text-xs text-slate-500">/malam</span>
          </div>
          {duration > 0 && <span className="text-xs font-medium text-slate-900 dark:text-white">{duration} malam dipilih</span>}
        </div>
        <button
          onClick={() => selectedRoom && handleRoomBooking(selectedRoom)}
          disabled={!selectedRoom || !!bookingBlockedReason}
          className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:bg-slate-300 dark:disabled:bg-slate-700"
        >
          {bookingBlockedReason || 'Reservasi'}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
      <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Detail Reservasi</h3>
      
      <div className="mb-6 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-red-600">{formatPrice(basePrice)}</span>
        <span className="text-sm text-slate-500">/malam</span>
      </div>

      <div className="mb-6 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-slate-600 dark:text-slate-400">Check-in</span>
          <span className="font-semibold text-slate-900 dark:text-white">{checkIn ? new Date(checkIn).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium text-slate-600 dark:text-slate-400">Check-out</span>
          <span className="font-semibold text-slate-900 dark:text-white">{checkOut ? new Date(checkOut).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium text-slate-600 dark:text-slate-400">Kamar Terpilih</span>
          <span className="font-semibold text-slate-900 dark:text-white max-w-30 truncate" title={selectedRoom?.room_type}>{selectedRoom?.room_type || 'Belum dipilih'}</span>
        </div>
        {duration > 0 && (
          <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-sm font-bold text-slate-900 dark:border-slate-700 dark:text-white">
            <span>Total ({duration} malam)</span>
            <span>{formatPrice(estimatedTotal)}</span>
          </div>
        )}
      </div>

      <button
        onClick={() => selectedRoom && handleRoomBooking(selectedRoom)}
        disabled={!selectedRoom || !!bookingBlockedReason}
        className="w-full rounded-xl bg-red-600 py-4 text-base font-bold text-white transition hover:bg-red-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed"
      >
        {bookingBlockedReason || 'Lanjutkan Reservasi'}
      </button>
      {!selectedRoom && (
        <p className="mt-3 text-center text-xs text-slate-500">Pilih tipe kamar untuk melanjutkan.</p>
      )}
    </div>
  );
};
