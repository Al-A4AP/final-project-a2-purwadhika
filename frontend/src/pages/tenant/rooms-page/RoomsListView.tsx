import type { FC } from "react";
import { Pencil, Trash2, CalendarDays, TrendingUp, Users, BedDouble } from "lucide-react";
import type { RoomWithPeakRates } from "@/types";
import { formatPrice } from "@/lib/formatters";

interface RoomsListViewProps {
  handleEdit: (room: RoomWithPeakRates) => void;
  handleOpenAvailModal: (id: string) => void;
  handleOpenPeakModal: (id: string) => void;
  isWholeUnit: boolean;
  onDelete: (id: string) => void;
  rooms: RoomWithPeakRates[];
}

const fallbackImage = "https://via.placeholder.com/300x200?text=Room";

export const RoomsListView: FC<RoomsListViewProps> = ({ 
  handleEdit, handleOpenAvailModal, handleOpenPeakModal, isWholeUnit, onDelete, rooms 
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      
      {/* Mobile View: Cards */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {rooms.map(room => (
          <div key={room.id} className="p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <div className="flex gap-4">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                <img src={room.images?.[0]?.image_url || fallbackImage} alt={room.room_type} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                  <h3 className="truncate font-bold text-slate-900 dark:text-white">
                    {isWholeUnit ? "Sewa Seluruh Properti" : room.room_type}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatPrice(room.base_price)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {room.capacity} Orang
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                    <BedDouble size={12} /> {room.quantity} Kamar
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(room)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-blue-600 transition hover:bg-blue-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-blue-900/20"><Pencil size={14} /></button>
                    <button onClick={() => onDelete(room.id)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-red-600 transition hover:bg-red-50 dark:border-slate-700 dark:text-red-400 dark:hover:bg-red-900/20"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleOpenAvailModal(room.id)}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <CalendarDays size={14} /> Ketersediaan
              </button>
              <button 
                onClick={() => handleOpenPeakModal(room.id)}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <TrendingUp size={14} /> Harga Khusus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">Tipe Kamar</th>
              <th scope="col" className="px-6 py-4 font-semibold">Harga & Kapasitas</th>
              <th scope="col" className="px-6 py-4 font-semibold text-right">Pengaturan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rooms.map(room => (
              <tr key={room.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                      <img src={room.images?.[0]?.image_url || fallbackImage} alt={room.room_type} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 dark:text-white text-base">
                          {isWholeUnit ? "Sewa Seluruh Properti" : room.room_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <BedDouble size={12} className="text-slate-400" />
                        <span>Stok: {room.quantity} Kamar</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1.5">
                    <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatPrice(room.base_price)} / malam
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <Users size={14} className="text-slate-400" /> 
                      Maksimal {room.capacity} Orang
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 mb-2">
                    <button
                      onClick={() => handleEdit(room)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-900/50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                      title="Edit Kamar"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(room.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900/50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      title="Hapus Kamar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenAvailModal(room.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <CalendarDays size={14} /> Ketersediaan
                    </button>
                    <button
                      onClick={() => handleOpenPeakModal(room.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <TrendingUp size={14} /> Harga Khusus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
