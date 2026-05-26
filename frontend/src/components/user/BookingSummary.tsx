import type { FC } from 'react';
import type { Room, PropertyDetail } from '@/types';
import { formatPrice } from '@/lib/formatters';

interface Props {
  property: PropertyDetail;
  room: Room;
  nights: number;
  guests: { adults: number; children: number; babies: number };
  totalPrice: number;
  totalRoomPrice: number;
  processing: boolean;
  onCheckout: () => void;
}

export const BookingSummary: FC<Props> = ({ property, room, nights, guests, totalPrice, totalRoomPrice, processing, onCheckout }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border dark:border-slate-700 sticky top-24">
    <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Ringkasan Pesanan</h2>
    <div className="flex gap-4 mb-6">
      <img src={property.featured_image_url || ''} alt="Property" className="w-20 h-20 rounded-lg object-cover" />
      <div>
        <p className="font-semibold text-gray-900 dark:text-white text-sm">{property.name}</p>
        <p className="text-xs text-gray-500">{room.room_type}</p>
      </div>
    </div>

    <div className="space-y-3 text-xs mb-6 border-y dark:border-slate-700 py-4 max-h-48 overflow-y-auto">
      <div className="font-semibold text-gray-700 dark:text-gray-300">Sewa Kamar ({nights} malam):</div>
      {room.priceDetails ? (
        room.priceDetails.breakdown.map((day, idx) => (
          <div key={idx} className="flex justify-between text-gray-600 dark:text-gray-400 pl-2">
            <span className="flex items-center gap-1">
              {day.date}
              {day.isPeak && <span className="text-[9px] bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 px-1 rounded font-semibold">{day.rateName || 'Peak'}</span>}
            </span>
            <span className="text-gray-905 dark:text-white font-medium font-mono">{day.price === 0 ? 'Gratis' : formatPrice(day.price)}</span>
          </div>
        ))
      ) : (
        <div className="flex justify-between pl-2">
          <span className="text-gray-600 dark:text-gray-400">{formatPrice(room.base_price)} x {nights} malam</span>
          <span className="text-gray-905 dark:text-white font-medium font-mono">{formatPrice(totalRoomPrice)}</span>
        </div>
      )}
      {guests.children > 0 && (
        <div className="pt-2 border-t border-gray-100 dark:border-slate-700/50 flex justify-between text-gray-600 dark:text-gray-400">
          <span>Tambahan Anak ({guests.children}x):</span>
          <span className="text-green-600 dark:text-green-400 font-medium">Gratis</span>
        </div>
      )}
      {guests.babies > 0 && (
        <div className="pt-2 border-t border-gray-100 dark:border-slate-700/50 flex justify-between text-gray-600 dark:text-gray-400">
          <span>Tambahan Bayi ({guests.babies}x):</span>
          <span className="text-green-600 dark:text-green-400 font-medium">Gratis</span>
        </div>
      )}
    </div>

    <div className="flex justify-between items-center mb-8">
      <span className="font-bold text-gray-900 dark:text-white">Total</span>
      {totalPrice === 0
        ? <span className="text-xl font-bold text-green-600 dark:text-green-400">Gratis</span>
        : <span className="text-xl font-bold text-red-600">{formatPrice(totalPrice)}</span>
      }
    </div>

    <button onClick={onCheckout} disabled={processing}
      className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-70">
      {processing ? 'Memproses...' : 'Lanjutkan Pembayaran'}
    </button>
  </div>
);
