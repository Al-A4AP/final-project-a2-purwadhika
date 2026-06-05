import type { FC, KeyboardEvent } from "react";
import type { usePropertiesFilters } from "@/hooks/tenant/properties-list/usePropertiesFilters";

type PropertiesFilters = ReturnType<typeof usePropertiesFilters>;
type SortValue = "name-asc" | "name-desc" | "created_at-desc" | "created_at-asc";

const sortOptions: { label: string; value: SortValue }[] = [
  { label: "Nama A-Z", value: "name-asc" },
  { label: "Nama Z-A", value: "name-desc" },
  { label: "Terbaru", value: "created_at-desc" },
  { label: "Terlama", value: "created_at-asc" },
];

export const PropertiesFilterPanel: FC<{ filters: PropertiesFilters; total: number }> = ({ filters, total }) => (
  <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <SearchField filters={filters} />
      <SortField filters={filters} />
    </div>
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{total} properti ditemukan</p>
      <FilterActions filters={filters} />
    </div>
  </div>
);

const SearchField: FC<{ filters: PropertiesFilters }> = ({ filters }) => (
  <label className={fieldClass}>
    <span className={labelClass}>Nama Properti</span>
    <input value={filters.searchQuery} onChange={(event) => filters.setSearchQuery(event.target.value)} onKeyDown={(event) => submitOnEnter(event, filters.applySearch)} placeholder="Cari nama properti..." className={inputClass} />
  </label>
);

const SortField: FC<{ filters: PropertiesFilters }> = ({ filters }) => (
  <label className={fieldClass}>
    <span className={labelClass}>Urutkan</span>
    <select value={`${filters.sortKey}-${filters.sortOrder}`} onChange={(event) => applySortValue(event.target.value as SortValue, filters)} className={inputClass}>
      {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </label>
);

const FilterActions: FC<{ filters: PropertiesFilters }> = ({ filters }) => (
  <div className="flex flex-col gap-3 sm:flex-row">
    <button type="button" onClick={filters.applySearch} className={primaryButtonClass}>Terapkan Filter</button>
    <button type="button" onClick={filters.resetFilters} className={secondaryButtonClass}>Reset</button>
  </div>
);

const applySortValue = (value: SortValue, filters: PropertiesFilters) => {
  const [sort, order] = value.split("-") as [string, "asc" | "desc"];
  filters.setSort(sort, order);
};

const submitOnEnter = (event: KeyboardEvent<HTMLInputElement>, applySearch: () => void) => {
  if (event.key === "Enter") applySearch();
};

const fieldClass = "space-y-1.5";
const labelClass = "text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400";
const inputClass = "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-orange-500/20";
const primaryButtonClass = "rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200";
const secondaryButtonClass = "rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700";
