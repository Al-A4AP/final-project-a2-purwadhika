import type { FC } from "react";
import type { SortFilterBarProps } from "./sortFilterTypes";

export const FilterActionBar: FC<{ props: SortFilterBarProps }> = ({ props }) =>
  props.hasFilterChanges ? (
    <div className="mb-6 flex gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700">
      <button onClick={props.onApplyFilters} className="px-6 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-medium text-sm tracking-wide">Terapkan Filter</button>
      <button onClick={props.onResetFilters} className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm">Reset</button>
    </div>
  ) : null;
