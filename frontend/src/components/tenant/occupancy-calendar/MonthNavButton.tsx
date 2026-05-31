import type { FC } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const MonthNavButton: FC<{ direction: "next" | "prev"; onClick: () => void }> = ({ direction, onClick }) => {
  const isPrev = direction === "prev";
  const label = isPrev ? "Bulan sebelumnya" : "Bulan berikutnya";
  const Icon = isPrev ? ChevronLeft : ChevronRight;
  return <button onClick={onClick} className="flex h-10 w-10 items-center justify-center rounded-lg border transition hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700" title={label} aria-label={label}><Icon size={18} /></button>;
};
