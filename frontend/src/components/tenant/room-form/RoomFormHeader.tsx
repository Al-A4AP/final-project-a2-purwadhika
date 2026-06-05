import type { FC } from "react";
import { Info } from "lucide-react";

interface RoomFormHeaderProps {
  isEditing: boolean;
  isWholeUnit: boolean;
}

const getHelpText = (isWholeUnit: boolean) =>
  isWholeUnit 
    ? "Properti ini disewakan sebagai satu unit penuh (stok otomatis dihitung satu). Anda hanya perlu mengatur harga dan gambar." 
    : "Jumlah unit kamar yang Anda masukkan akan menjadi stok harian. Anda dapat menggunakan kalender ketersediaan untuk memblokir tanggal tertentu nantinya.";

export const RoomFormHeader: FC<RoomFormHeaderProps> = ({ isWholeUnit }) => (
  <div className="mb-6 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-300">
    <Info size={18} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
    <p>{getHelpText(isWholeUnit)}</p>
  </div>
);
