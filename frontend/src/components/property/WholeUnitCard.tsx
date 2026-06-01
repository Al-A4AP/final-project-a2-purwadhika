import type { FC } from 'react';
import type { Room } from '@/types';
import { AlertTriangle, BedDouble, Calendar as CalendarIcon } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';
import { AmenitiesList } from './AmenitiesList';

interface WholeUnitCardProps {
  amenities?: string[];
  bookingBlockedReason?: string;
  categoryName: string;
  isTenant: boolean;
  room: Room;
  onBooking: (room: Room) => void;
  onCheckAvail: (room: Room) => void;
}

export const WholeUnitCard: FC<WholeUnitCardProps> = (props) => (
  <div className="rounded-xl border bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <WholeUnitHeader categoryName={props.categoryName} />
    <WholeUnitInfo {...props} />
    <UnavailableNotice room={props.room} />
    {!props.isTenant && <WholeUnitActions {...props} />}
  </div>
);

const WholeUnitHeader: FC<{ categoryName: string }> = ({ categoryName }) => (
  <>
    <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{categoryName === 'Villa' ? 'Sewa Seluruh Villa' : 'Sewa Seluruh Rumah'}</h2>
    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Anda akan menyewa seluruh {categoryName?.toLowerCase()} ini secara eksklusif.</p>
  </>
);

const WholeUnitInfo: FC<WholeUnitCardProps> = ({ amenities, room }) => (
  <div className="flex flex-wrap items-center justify-between gap-6">
    <RoomDescription room={room} />
    <AmenitiesList amenities={amenities} compact />
    <WholeUnitPrice room={room} />
  </div>
);

const RoomDescription: FC<{ room: Room }> = ({ room }) => (
  <div className="space-y-1">
    <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400"><BedDouble size={16} /> Kapasitas: {room.capacity} orang</span>
    {room.description && <p className="text-sm text-gray-500">{room.description}</p>}
  </div>
);

const WholeUnitPrice: FC<{ room: Room }> = ({ room }) => {
  const price = getRoomPrice(room);
  return <div className="text-right"><p className={`text-3xl font-bold ${price === 0 ? 'text-green-600' : 'text-red-600'}`}>{price === 0 ? 'Gratis' : formatPrice(price)}</p><p className="text-sm text-gray-500">{room.priceDetails ? `total (${room.priceDetails.nights} malam)` : '/ malam (seluruh unit)'}</p></div>;
};

const UnavailableNotice: FC<{ room: Room }> = ({ room }) => (
  room.is_available === false ? (
    <div className="mt-4 flex items-start gap-1.5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
      <AlertTriangle size={16} className="mt-0.5 shrink-0" />
      <span>{room.reason || 'Kamar tidak tersedia pada tanggal yang dipilih.'}</span>
    </div>
  ) : null
);

const WholeUnitActions: FC<WholeUnitCardProps> = (props) => {
  const disabled = props.room.is_available === false || Boolean(props.bookingBlockedReason);
  return <div className="mt-6 flex gap-3 border-t pt-6 dark:border-slate-700"><AvailabilityButton {...props} /><BookingButton disabled={disabled} {...props} /></div>;
};

const AvailabilityButton: FC<WholeUnitCardProps> = ({ onCheckAvail, room }) => (
  <button onClick={() => onCheckAvail(room)} className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm text-gray-600 transition hover:bg-gray-100 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700">
    <CalendarIcon size={16} /> Cek Ketersediaan
  </button>
);

const BookingButton: FC<WholeUnitCardProps & { disabled: boolean }> = ({ bookingBlockedReason, disabled, onBooking, room }) => (
  <button onClick={() => onBooking(room)} disabled={disabled} className={`flex-1 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition ${buttonClass(disabled)}`}>
    {statusLabel(room, bookingBlockedReason)}
  </button>
);

const getRoomPrice = (room: Room) =>
  room.priceDetails ? room.priceDetails.totalPrice : room.base_price;

const statusLabel = (room: Room, reason?: string) => {
  if (room.is_available === false) return unavailableLabel(room, reason);
  if (reason) return reason.includes('verifikasi') ? 'Verifikasi Email' : 'Login Diperlukan';
  return 'Pesan Sekarang';
};

const unavailableLabel = (room: Room, reason?: string) =>
  room.availability_source === 'CUSTOMER_BOOKED' || (room.reason || reason)?.toLowerCase().includes('penuh')
    ? 'Sudah terisi'
    : 'Tidak tersedia';

const buttonClass = (disabled: boolean) =>
  disabled ? 'cursor-not-allowed bg-gray-400 text-gray-200 dark:bg-slate-700' : 'bg-red-600 hover:bg-red-700';
