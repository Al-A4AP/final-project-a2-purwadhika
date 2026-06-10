import type { FC, KeyboardEvent, ReactNode } from 'react';
import type { Room } from '@/types';
import { AlertTriangle, BedDouble } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';
import { getBlockedReasonLabel } from '@/hooks/user/property-detail/propertyDetailAccess';
import { AmenitiesList } from './AmenitiesList';

type PriceDay = { date: string; price: number; isPeak: boolean; rateName?: string };

interface RoomCardProps {
  amenities?: string[];
  bookingBlockedReason?: string;
  isTenant: boolean;
  isSelected?: boolean;
  room: Room;
  onBooking: (room: Room) => void;
  onSelectRoom?: (roomId: string) => void;
}

export const RoomCard: FC<RoomCardProps> = (props) => (
  <div className={roomCardClass(props.room, props.isSelected)} role="button" tabIndex={cardTabIndex(props.room)}
    onClick={() => selectRoom(props)} onKeyDown={(event) => handleCardKey(event, props)}
  >
    <SelectedBadge isSelected={props.isSelected} />
    <RoomImage room={props.room} />
    <RoomDetails amenities={props.amenities} room={props.room} />
    <RoomRateBreakdown room={props.room} />
    <UnavailableNotice room={props.room} />
    <RoomFooter {...props} />
  </div>
);

const SelectedBadge: FC<{ isSelected?: boolean }> = ({ isSelected }) => (
  isSelected ? <span className="mb-3 inline-flex w-fit rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">Dipilih</span> : null
);

const RoomImage: FC<{ room: Room }> = ({ room }) => (
  room.images?.[0] ? <img src={room.images[0].image_url} alt={room.room_type} className="mb-4 h-40 w-full rounded-lg object-cover" /> : null
);

const RoomDetails: FC<{ amenities?: string[]; room: Room }> = ({ amenities, room }) => (
  <div className="flex-1">
    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{room.room_type}</h3>
    <span className="mb-4 flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400"><BedDouble size={16} /> Kapasitas: {room.capacity}</span>
    {room.description && <p className="mb-4 text-sm text-gray-500">{room.description}</p>}
    <AmenitiesList amenities={amenities} compact />
  </div>
);

const RoomRateBreakdown: FC<{ room: Room }> = ({ room }) => (
  room.priceDetails ? <div className="mb-4 mt-4"><PriceBreakdown breakdown={room.priceDetails.breakdown} small /></div> : null
);

const UnavailableNotice: FC<{ room: Room }> = ({ room }) => (
  room.is_available === false ? (
    <div className="mb-4 flex items-start gap-1.5 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
      <AlertTriangle size={14} className="mt-0.5 shrink-0" />
      <span>{room.reason || 'Kamar tidak tersedia pada tanggal yang dipilih.'}</span>
    </div>
  ) : null
);

const RoomFooter: FC<RoomCardProps> = (props) => (
  <div className="mt-auto flex items-center justify-between border-t pt-4 dark:border-slate-700">
    <RoomPrice room={props.room} />
    {!props.isTenant && <RoomActions {...props} />}
  </div>
);

const RoomActions: FC<RoomCardProps> = (props) => {
  const disabled = props.room.is_available === false || Boolean(props.bookingBlockedReason);
  return <div className="flex gap-2"><BookingButton disabled={disabled} {...props} /></div>;
};

const BookingButton: FC<RoomCardProps & { disabled: boolean }> = ({ bookingBlockedReason, disabled, onBooking, room }) => (
  <button onClick={() => onBooking(room)} disabled={disabled} className={`rounded-lg px-6 py-2 text-sm font-medium transition ${bookingClass(disabled)}`}>
    {getBookingLabel(room, bookingBlockedReason)}
  </button>
);

const RoomPrice: FC<{ room: Room }> = ({ room }) => {
  const roomPrice = room.priceDetails ? room.priceDetails.totalPrice : room.base_price;
  return <div><PriceText price={roomPrice} /><NightText room={room} />{averageNightText(room, roomPrice)}</div>;
};

const PriceText: FC<{ price: number }> = ({ price }) => (
  price === 0 ? <p className="text-lg font-bold text-green-600 dark:text-green-400">Gratis</p> : <p className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(price)}</p>
);

const NightText: FC<{ room: Room }> = ({ room }) => (
  <p className="text-xs text-gray-500">{room.priceDetails ? `total (${room.priceDetails.nights} malam)` : '/ malam'}</p>
);

const averageNightText = (room: Room, roomPrice: number): ReactNode => (
  room.priceDetails && room.priceDetails.nights > 1 && roomPrice > 0
    ? <p className="mt-0.5 text-[10px] text-gray-400">Rata-rata: {formatPrice(Math.round(roomPrice / room.priceDetails.nights))}</p>
    : null
);

export const PriceBreakdown: FC<{ breakdown: PriceDay[]; small?: boolean }> = ({ breakdown, small }) => (
  <div className={`${breakdownClass(small)} space-y-1 rounded-lg border bg-gray-50 dark:border-slate-750 dark:bg-slate-700/30`}>
    <p className={`${small ? 'mb-1.5 text-xs' : 'mb-2 text-sm'} font-semibold text-gray-700 dark:text-gray-300`}>Rincian Harga Menginap:</p>
    {breakdown.map((day, idx) => <PriceBreakdownRow key={idx} day={day} small={small} />)}
  </div>
);

const PriceBreakdownRow: FC<{ day: PriceDay; small?: boolean }> = ({ day, small }) => (
  <div className={`${small ? 'py-0.5 text-xs' : 'py-1 text-sm'} flex justify-between border-b border-gray-100 text-gray-600 last:border-0 dark:border-slate-700/50 dark:text-gray-400`}>
    <span className={`flex items-center ${small ? 'gap-1' : 'gap-2'}`}>{day.date}{day.isPeak && <PeakTag label={day.rateName} small={small} />}</span>
    <span className="font-medium">{day.price === 0 ? 'Gratis' : formatPrice(day.price)}</span>
  </div>
);

const PeakTag: FC<{ label?: string; small?: boolean }> = ({ label, small }) => (
  <span className={`${small ? 'px-1 text-[9px]' : 'px-2 text-[10px]'} rounded-md bg-amber-100 py-0.5 font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400`}>{label || 'Peak Season'}</span>
);

const breakdownClass = (small?: boolean) => small ? 'p-3 text-xs' : 'p-4 text-sm';

const bookingClass = (disabled: boolean) =>
  disabled ? 'cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500' : 'bg-red-600 text-white hover:bg-red-700 shadow-sm';

const cardTabIndex = (room: Room) => room.is_available === false ? -1 : 0;

const handleCardKey = (event: KeyboardEvent<HTMLDivElement>, props: RoomCardProps) => {
  if (!['Enter', ' '].includes(event.key)) return;
  event.preventDefault();
  selectRoom(props);
};

const roomCardClass = (room: Room, selected?: boolean) => [
  'flex flex-col rounded-2xl border p-6 shadow-sm transition-all',
  selected ? selectedClass : defaultClass,
  room.is_available === false ? disabledCardClass : enabledCardClass,
].join(' ');

const selectRoom = ({ onSelectRoom, room }: RoomCardProps) => {
  if (room.is_available === false) return;
  onSelectRoom?.(room.id);
};

const selectedClass = 'border-red-500 bg-red-50/50 ring-2 ring-red-100 dark:border-red-500 dark:bg-red-900/10 dark:ring-red-900/30';
const defaultClass = 'border-slate-100 bg-white/60 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60';
const disabledCardClass = 'opacity-70 grayscale-[0.2]';
const enabledCardClass = 'cursor-pointer hover:border-slate-300 hover:shadow-md dark:hover:border-slate-600';

const getBookingLabel = (room: Room, reason?: string) => {
  if (room.is_available === false) return getUnavailableLabel(room);
  return getBlockedReasonLabel(reason, 'Pesan');
};

const getUnavailableLabel = (room: Room) =>
  room.availability_source === 'CUSTOMER_BOOKED' || room.reason?.toLowerCase().includes('penuh')
    ? 'Kamar sudah penuh'
    : 'Tidak tersedia';
