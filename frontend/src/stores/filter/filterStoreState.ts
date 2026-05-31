import { initialFilterValues, initialState } from "./filterDefaults";
import { createFilterActions } from "./filterActions";
import { createFilterSetters } from "./filterSetters";
import type { FilterGet, FilterSet, FilterStore } from "./filterTypes";

export const createFilterStoreState = (set: FilterSet, get: FilterGet): FilterStore => ({
  ...initialState,
  appliedAt: 0,
  activeFilters: initialFilterValues,
  ...createFilterSetters(set),
  ...createFilterActions(set, get),
});
