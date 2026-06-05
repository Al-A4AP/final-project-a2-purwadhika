import type { FC } from "react";
import { useFilterStore } from "@/stores/filterStore";

export const HomeFilterActions: FC<HomeFilterActionsProps> = ({ hasFilterChanges, onApplied }) => {
  const filters = useFilterStore();
  if (!hasFilterChanges) return null;
  return (
    <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
      <button onClick={() => applyFilters(filters.applyFilters, onApplied)} className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700">Terapkan Filter</button>
      <button onClick={() => applyFilters(filters.resetFilters, onApplied)} className="rounded-lg bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Reset</button>
    </div>
  );
};

const applyFilters = (action: () => void, onApplied?: () => void) => {
  action();
  onApplied?.();
};

interface HomeFilterActionsProps {
  hasFilterChanges: boolean;
  onApplied?: () => void;
}
