import type { FC } from "react";
import { BedDouble, Banknote, Users } from "lucide-react";
import type { RoomWithPeakRates } from "@/types";
import { formatPrice } from "@/lib/formatters";

interface RoomsSummaryProps {
  rooms: RoomWithPeakRates[];
}

export const RoomsSummary: FC<RoomsSummaryProps> = ({ rooms }) => {
  const totalRooms = rooms.length;
  
  const avgPrice = totalRooms > 0 
    ? rooms.reduce((acc, room) => acc + room.base_price, 0) / totalRooms 
    : 0;
    
  const maxCapacity = totalRooms > 0 
    ? Math.max(...rooms.map(room => room.capacity)) 
    : 0;

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <BedDouble size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Tipe Kamar</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalRooms}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <Banknote size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Rata-rata Harga</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {totalRooms > 0 ? formatPrice(avgPrice) : "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Kapasitas Maksimal</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {totalRooms > 0 ? `${maxCapacity} Orang` : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
