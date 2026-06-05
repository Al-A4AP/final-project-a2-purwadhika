import type { FC } from "react";
import { formatCurrency } from "@/lib/formatters";
import type { RoomWithPeakRates } from "@/types";
import type { PeakSeasonPageState } from "./peakSeasonTypes";

export const PeakSeasonRoomRow: FC<PeakSeasonRoomRowProps> = ({ propertyId, room, state }) => (
  <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h3 className="font-bold text-slate-900 dark:text-white">{room.room_type}</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {formatCurrency(room.base_price)} / malam - {room.peakRates?.length || 0} aturan aktif
      </p>
    </div>
    <button type="button" onClick={() => state.modal.open(room, propertyId)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700">
      Atur Harga Musiman
    </button>
  </div>
);

interface PeakSeasonRoomRowProps {
  propertyId: string;
  room: RoomWithPeakRates;
  state: PeakSeasonPageState;
}
