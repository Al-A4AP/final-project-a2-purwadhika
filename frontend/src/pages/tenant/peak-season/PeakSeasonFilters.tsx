import type { FC, KeyboardEvent } from "react";
import { PEAK_SORT_OPTIONS, type PeakSortValue } from "@/hooks/tenant/peak-season/peakSeasonOptions";
import type { PeakSeasonPageState } from "@/hooks/tenant/peak-season/peakSeasonTypes";

export const PeakSeasonFilters: FC<{ state: PeakSeasonPageState }> = ({ state }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
      <SearchField state={state} />
      <CategoryField state={state} />
      <SortField state={state} />
    </div>
    <FilterActions state={state} />
  </div>
);

const SearchField: FC<{ state: PeakSeasonPageState }> = ({ state }) => (
  <label className={fieldClass}>
    <span className={labelClass}>Nama Properti</span>
    <input
      value={state.filters.searchInput}
      onChange={(event) => state.propertyActions.setSearchInput(event.target.value)}
      onKeyDown={(event) => submitOnEnter(event, state.propertyActions.applySearch)}
      placeholder="Cari nama properti..."
      className={inputClass}
    />
  </label>
);

const CategoryField: FC<{ state: PeakSeasonPageState }> = ({ state }) => (
  <label className={fieldClass}>
    <span className={labelClass}>Kategori</span>
    <select value={state.filters.categoryId} onChange={(event) => state.propertyActions.setCategoryId(event.target.value)} className={inputClass}>
      <option value="">Semua kategori</option>
      {state.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
    </select>
  </label>
);

const SortField: FC<{ state: PeakSeasonPageState }> = ({ state }) => (
  <label className={fieldClass}>
    <span className={labelClass}>Urutkan</span>
    <select value={state.filters.sortOption} onChange={(event) => state.propertyActions.setSortOption(event.target.value as PeakSortValue)} className={inputClass}>
      {PEAK_SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </label>
);

const FilterActions: FC<{ state: PeakSeasonPageState }> = ({ state }) => (
  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
    <button type="button" onClick={state.propertyActions.applySearch} className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">Terapkan Filter</button>
    <button type="button" onClick={state.propertyActions.resetFilters} className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Reset</button>
  </div>
);

const submitOnEnter = (event: KeyboardEvent<HTMLInputElement>, applySearch: () => void) => {
  if (event.key === "Enter") applySearch();
};

const fieldClass = "space-y-1.5";
const inputClass = "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-orange-500/20";
const labelClass = "text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400";
