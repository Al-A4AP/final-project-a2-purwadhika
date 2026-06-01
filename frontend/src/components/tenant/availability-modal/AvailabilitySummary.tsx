import type { FC } from "react";
import type { DateRange } from "react-day-picker";

export const AvailabilitySummary: FC<{ isAvailable: boolean; range?: DateRange }> = ({ isAvailable, range }) => (
  <div className="rounded-lg border border-dashed border-gray-200 p-3 text-sm text-gray-600 dark:border-slate-700 dark:text-gray-300">
    <p>{rangeText(range)}</p>
    <p className={isAvailable ? "mt-1 font-semibold text-emerald-600" : "mt-1 font-semibold text-red-600"}>{actionText(isAvailable)}</p>
  </div>
);

const rangeText = (range?: DateRange) => {
  if (range?.from && range.to) return `Rentang: ${formatLocalDate(range.from)} sampai ${formatLocalDate(range.to)}`;
  if (range?.from) return `Mulai: ${formatLocalDate(range.from)}. Pilih tanggal selesai.`;
  return "Pilih tanggal mulai dan tanggal selesai pada kalender.";
};

const actionText = (isAvailable: boolean) =>
  isAvailable ? "Aksi: jadikan tersedia kembali." : "Aksi: tandai tidak tersedia dengan warna kuning.";

const formatLocalDate = (date: Date) =>
  date.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
