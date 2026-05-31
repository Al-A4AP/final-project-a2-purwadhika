import type { FC } from "react";
import { CalendarIcon } from "lucide-react";

export const PricingCalendarHeader: FC = () => (
  <>
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
      <CalendarIcon size={20} className="text-red-600" /> Pilih Tanggal & Lihat Perbandingan Harga
    </h2>
    <p className="text-sm text-gray-500 mb-6">Harga yang ditampilkan adalah harga termurah yang tersedia per malam.</p>
    <p className="text-sm text-gray-50 mb-6">Klik sekali pada tanggal yang dipilih untuk membatalkan check-in atau check-out.</p>
  </>
);
