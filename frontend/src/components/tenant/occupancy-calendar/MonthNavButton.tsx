import type { FC } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const MonthNavButton: FC<{ direction: "next" | "prev"; disabled?: boolean; onClick: () => void }> = ({ direction, disabled, onClick }) => {
  const { Icon, label } = getNavMeta(direction);
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white" 
      title={label} 
      aria-label={label}
    >
      <Icon size={18} />
    </button>
  );
};

const getNavMeta = (direction: "next" | "prev") => ({
  Icon: direction === "prev" ? ChevronLeft : ChevronRight,
  label: direction === "prev" ? "Bulan sebelumnya" : "Bulan berikutnya",
});
