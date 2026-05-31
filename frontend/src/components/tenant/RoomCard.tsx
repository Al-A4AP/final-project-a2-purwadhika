import type { FC } from 'react';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar as CalendarIcon, TrendingUp, Pencil, Trash2 } from 'lucide-react';
import type { RoomWithPeakRates, PeakSeasonRate } from '@/types';
import { formatPrice } from '@/lib/formatters';

interface RoomCardProps {
  room: RoomWithPeakRates;
  onDelete: (id: string) => void;
  onEdit: (room: RoomWithPeakRates) => void;
  onOpenAvail: (id: string) => void;
  onOpenPeakRates: (id: string) => void;
}

export const RoomCard: FC<RoomCardProps> = ({ room, onDelete, onEdit, onOpenAvail, onOpenPeakRates }) => {
  const [showRates, setShowRates] = useState(false);
  return (
    <div className="border dark:border-slate-700 rounded-xl p-4 space-y-3 bg-white dark:bg-slate-800">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          {room.images?.[0] && (
            <img src={room.images[0].image_url} alt={room.room_type} className="w-20 h-20 rounded-lg object-cover border dark:border-slate-700" />
          )}
          <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white">{room.room_type}</h3>
          <p className="text-sm text-gray-500">Kapasitas: {room.capacity} orang · {formatPrice(room.base_price)}/malam (Dewasa)</p>
          {room.child_price != null && (
            <p className="text-xs text-blue-600 dark:text-blue-400">{formatPrice(room.child_price)}/malam (Anak) · Bayi: Gratis</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Jumlah unit: {room.quantity}</p>
          {room.description && <p className="text-xs text-gray-400 mt-1">{room.description}</p>}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:flex sm:shrink-0">
          <button onClick={() => onOpenAvail(room.id)} className="flex h-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 sm:w-10" title="Atur Ketersediaan" aria-label={`Atur ketersediaan ${room.room_type}`}>
            <CalendarIcon size={14} />
          </button>
          <button onClick={() => onOpenPeakRates(room.id)} className="flex h-10 items-center justify-center rounded-lg text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 sm:w-10" title="Atur Peak Season" aria-label={`Atur peak season ${room.room_type}`}>
            <TrendingUp size={14} />
          </button>
          <button onClick={() => onEdit(room)} className="flex h-10 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 sm:w-10" title="Edit Kamar" aria-label={`Edit kamar ${room.room_type}`}>
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(room.id)} className="flex h-10 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 sm:w-10" title="Hapus Kamar" aria-label={`Hapus kamar ${room.room_type}`}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {room.peakRates?.length > 0 && (
        <div>
          <button onClick={() => setShowRates(!showRates)} className="flex min-h-10 items-center gap-1 text-xs text-gray-500 hover:text-gray-700" aria-expanded={showRates}>
            {showRates ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {room.peakRates.length} Peak Rate
          </button>
          {showRates && (
            <div className="mt-2 space-y-1">
              {room.peakRates.map((r: PeakSeasonRate) => (
                <div key={r.id} className="text-xs flex justify-between bg-orange-50 dark:bg-orange-900/10 rounded px-3 py-1.5 border dark:border-orange-950/20">
                  <span>{new Date(r.start_date).toLocaleDateString('id-ID')} – {new Date(r.end_date).toLocaleDateString('id-ID')}</span>
                  <span className="font-medium text-orange-600 dark:text-orange-400">
                    {r.rate_type === 'PERCENTAGE' ? `+${r.rate_value}%` : `+${formatPrice(r.rate_value)}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
