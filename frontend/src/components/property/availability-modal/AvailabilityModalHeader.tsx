import type { FC } from "react";
import type { Room } from "@/types";

export const AvailabilityModalHeader: FC<{ room: Room; onClose: () => void }> = ({ room, onClose }) => (
  <div className="mb-5 flex items-start justify-between gap-4">
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cek Ketersediaan Kamar</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{room.room_type}</p>
    </div>
    <button onClick={onClose} className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-700">
      Batal
    </button>
  </div>
);
