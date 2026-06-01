import type { FC } from "react";
import type { Room } from "@/types";
import { CalendarIcon } from "lucide-react";

export const PricingCalendarHeader: FC<{ selectedRoom: Room | null }> = ({ selectedRoom }) => (
  <>
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
      <CalendarIcon size={20} className="text-red-600" /> Pilih Tanggal & Lihat Perbandingan Harga
    </h2>
    <p className="text-sm text-gray-500 mb-2">{headerText(selectedRoom)}</p>
    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Klik sekali pada tanggal yang dipilih untuk membatalkan check-in atau check-out.</p>
  </>
);

const headerText = (room: Room | null) =>
  room ? `Harga dan status mengikuti kamar yang dipilih: ${room.room_type}.` : "Pilih kamar untuk melihat harga dan status per tanggal.";
