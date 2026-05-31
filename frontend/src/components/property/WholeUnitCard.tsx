import type { FC } from 'react';
import type { Room } from '@/types';
import { AlertTriangle, BedDouble, Calendar as CalendarIcon } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';
import { AmenitiesList } from './AmenitiesList';

interface WholeUnitCardProps {
  room: Room;
  amenities?: string[];
  isTenant: boolean;
  categoryName: string;
  bookingBlockedReason?: string;
  onBooking: (room: Room) => void;
  onCheckAvail: (room: Room) => void;
}

const statusLabel = (room: Room, reason?: string) => {
  if (room.is_available === false) return 'Tidak Tersedia';
  if (reason) return reason.includes('verifikasi') ? 'Verifikasi Email' : 'Login Diperlukan';
  return 'Pesan Sekarang';
};

const buttonClass = (disabled: boolean) =>
  `flex-1 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition ${disabled ? 'cursor-not-allowed bg-gray-400 text-gray-200 dark:bg-slate-700' : 'bg-red-600 hover:bg-red-700'}`;

const UnavailableNotice: FC<{ room: Room }> = ({ room }) => (
  <div className="mt-4 flex items-start gap-1.5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
    <span>{room.reason || 'Kamar tidak tersedia pada tanggal yang dipilih.'}</span>
  </div>
);

export const WholeUnitCard: FC<WholeUnitCardProps> = ({ room, amenities, isTenant, categoryName, bookingBlockedReason, onBooking, onCheckAvail }) => {
  const price = room.priceDetails ? room.priceDetails.totalPrice : room.base_price;
  const disabled = room.is_available === false || Boolean(bookingBlockedReason);
  return (
    <div className="rounded-xl border bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{categoryName === 'Villa' ? 'Sewa Seluruh Villa' : 'Sewa Seluruh Rumah'}</h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Anda akan menyewa seluruh {categoryName?.toLowerCase()} ini secara eksklusif.</p>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1"><span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400"><BedDouble size={16} /> Kapasitas: {room.capacity} orang</span>{room.description && <p className="text-sm text-gray-500">{room.description}</p>}</div>
        <AmenitiesList amenities={amenities} compact />
        <div className="text-right"><p className={`text-3xl font-bold ${price === 0 ? 'text-green-600' : 'text-red-600'}`}>{price === 0 ? 'Gratis' : formatPrice(price)}</p><p className="text-sm text-gray-500">{room.priceDetails ? `total (${room.priceDetails.nights} malam)` : '/ malam (seluruh unit)'}</p></div>
      </div>
      {room.is_available === false && <UnavailableNotice room={room} />}
      {!isTenant && (
        <div className="mt-6 flex gap-3 border-t pt-6 dark:border-slate-700">
          <button onClick={() => onCheckAvail(room)} className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm text-gray-600 transition hover:bg-gray-100 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"><CalendarIcon size={16} /> Cek Ketersediaan</button>
          <button onClick={() => onBooking(room)} disabled={disabled} className={buttonClass(disabled)}>{statusLabel(room, bookingBlockedReason)}</button>
        </div>
      )}
    </div>
  );
};
