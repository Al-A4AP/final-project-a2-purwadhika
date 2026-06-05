import type { FC } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const MonthNavButton: FC<{ direction: "next" | "prev"; onClick: () => void }> = ({ direction, onClick }) => {
  const isPrev = direction === "prev";
  const label = isPrev ? "Bulan sebelumnya" : "Bulan berikutnya";
  const Icon = isPrev ? ChevronLeft : ChevronRight;
  return (
    <button 
      onClick={onClick} 
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white" 
      title={label} 
      aria-label={label}
    >
      <Icon size={18} />
    </button>
  );
};
