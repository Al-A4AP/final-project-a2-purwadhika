import type { FC } from "react";
import { AlertTriangle } from "lucide-react";

export const NoRoomsNotice: FC = () => (
  <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
    <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
    <h2 className="mb-2 text-xl font-bold">Unit Tidak Tersedia</h2>
    <p>Maaf, properti ini tidak memiliki kamar yang tersedia pada tanggal yang Anda pilih. Silakan ubah rentang tanggal check-in dan check-out Anda.</p>
  </div>
);
