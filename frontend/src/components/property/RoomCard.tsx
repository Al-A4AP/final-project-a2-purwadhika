import type { FC } from 'react';
import type { Room } from '@/types';
import { BedDouble, Calendar as CalendarIcon, AlertTriangle } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';

interface PriceBreakdownProps {
  breakdown: { date: string; price: number; isPeak: boolean; rateName?: string }[];
  small?: boolean;
}

const PriceBreakdown: FC<PriceBreakdownProps> = ({ breakdown, small }) => (
  <div className={`${small ? 'text-xs' : 'text-sm'} bg-gray-50 dark:bg-slate-700/30 p-${small ? '3' : '4'} rounded-lg space-y-1 border dark:border-slate-750`}>
    <p className={`font-semibold text-gray-700 dark:text-gray-300 mb-${small ? '1.5' : '2'}`}>Rincian Harga Menginap:</p>
    {breakdown.map((day, idx) => (
      <div key={idx} className={`flex justify-between text-gray-600 dark:text-gray-400 py-${small ? '0.5' : '1'} border-b border-gray-100 dark:border-slate-700/50 last:border-0`}>
        <span className="flex items-center gap-${small ? '1' : '2'}">
          {day.date}
          {day.isPeak && (
            <span className={`text-[${small ? '9' : '10'}px] bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 px-${small ? '1' : '2'} py-0.5 rounded font-semibold`}>
              {day.rateName || 'Peak Season'}
            </span>
          )}
        </span>
        <span className="font-medium">{day.price === 0 ? 'Gratis' : formatPrice(day.price)}</span>
      </div>
    ))}
  </div>
);

interface RoomCardProps {
  room: Room;
  isTenant: boolean;
  onBooking: (room: Room) => void;
  onCheckAvail: (room: Room) => void;
}

export const RoomCard: FC<RoomCardProps> = ({ room, isTenant, onBooking, onCheckAvail }) => {
  const roomPrice = room.priceDetails ? room.priceDetails.totalPrice : room.base_price;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border dark:border-slate-700 flex flex-col">
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{room.room_type}</h3>
        <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span className="flex items-center gap-1"><BedDouble size={16} /> Kapasitas: {room.capacity}</span>
        </div>
        {room.description && <p className="text-sm text-gray-500 mb-4">{room.description}</p>}
      </div>

      {room.priceDetails && <div className="mt-4 mb-4"><PriceBreakdown breakdown={room.priceDetails.breakdown} small /></div>}

      {room.is_available === false && (
        <div className="mb-4 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-xs flex items-start gap-1.5">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>{room.reason || 'Kamar tidak tersedia pada tanggal yang dipilih.'}</span>
        </div>
      )}

      <div className="pt-4 border-t dark:border-slate-700 flex items-center justify-between mt-auto">
        <div>
          {roomPrice === 0
            ? <p className="font-bold text-lg text-green-600 dark:text-green-400">Gratis</p>
            : <p className="font-bold text-lg text-gray-900 dark:text-white">{formatPrice(roomPrice)}</p>
          }
          <p className="text-xs text-gray-500">{room.priceDetails ? `total (${room.priceDetails.nights} malam)` : '/ malam'}</p>
          {room.priceDetails && room.priceDetails.nights > 1 && roomPrice > 0 && (
            <p className="text-[10px] text-gray-400 mt-0.5">Rata-rata: {formatPrice(Math.round(roomPrice / room.priceDetails.nights))}</p>
          )}
        </div>
        <div className="flex gap-2">
          {!isTenant && (
            <button onClick={() => onCheckAvail(room)} className="p-2 border dark:border-slate-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition" title="Cek Ketersediaan">
              <CalendarIcon size={18} />
            </button>
          )}
          {!isTenant && (
            <button onClick={() => onBooking(room)} disabled={room.is_available === false}
              className={`px-6 py-2 rounded-lg font-medium transition text-sm ${room.is_available === false ? 'bg-gray-400 dark:bg-slate-700 text-gray-200 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}>
              {room.is_available === false ? 'Penuh' : 'Pesan'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export { PriceBreakdown };
