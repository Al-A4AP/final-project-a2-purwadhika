import { initialFilterValues, initialState } from "./filterDefaults";
import { normalizeFilters, selectFilterValues } from "./filterNormalize";
import type { FilterGet, FilterSet, FilterValues } from "./filterTypes";

export const createFilterActions = (set: FilterSet, get: FilterGet) => ({
  applyFilters: () => set({ activeFilters: get().getFilterValues(), appliedAt: Date.now() }),
  applyFilterValues: (values: FilterValues) => applyFilterValues(set, values),
  resetFilters: () => resetFilters(set),
  getFilterValues: () => selectFilterValues(get()),
});

const applyFilterValues = (set: FilterSet, values: FilterValues) => {
  const next = normalizeFilters(values);
  set({ ...next, activeFilters: next, appliedAt: Date.now() });
};

const resetFilters = (set: FilterSet) =>
  set({ ...initialState, activeFilters: initialFilterValues, appliedAt: Date.now() });
