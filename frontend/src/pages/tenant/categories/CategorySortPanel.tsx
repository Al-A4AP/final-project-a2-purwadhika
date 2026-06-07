import type { FC } from "react";
import type { CategoryViewState } from "@/hooks/tenant/categories/useCategoryViewState";

type SortValue = "updated_at-desc" | "updated_at-asc" | "name-asc" | "name-desc";

const sortOptions: { label: string; value: SortValue }[] = [
  { label: "Terbaru", value: "updated_at-desc" },
  { label: "Terlama", value: "updated_at-asc" },
  { label: "Nama A-Z", value: "name-asc" },
  { label: "Nama Z-A", value: "name-desc" },
];

export const CategorySortPanel: FC<{ view: CategoryViewState }> = ({ view }) => (
  <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <label className="block space-y-1.5 sm:max-w-xs">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Urutkan Kategori</span>
      <select
        value={`${view.data.sortBy}-${view.data.sortOrder}`}
        onChange={(event) => applySort(event.target.value as SortValue, view)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-orange-500/20"
      >
        {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  </div>
);

const applySort = (value: SortValue, view: CategoryViewState) => {
  const [sortBy, sortOrder] = value.split("-") as ["name" | "updated_at", "asc" | "desc"];
  view.data.setSort(sortBy, sortOrder);
};
