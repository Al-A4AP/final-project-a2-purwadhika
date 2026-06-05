import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FILTER_STORAGE_KEY, selectPersistedFilters } from "./filter/filterPersistence";
import { createFilterStoreState } from "./filter/filterStoreState";
import type { FilterStore } from "./filter/filterTypes";

export type { FilterValues } from "./filter/filterTypes";

export const useFilterStore = create<FilterStore>()(
  persist(
    (set, get) => createFilterStoreState(set, get),
    { name: FILTER_STORAGE_KEY, partialize: selectPersistedFilters },
  ),
);
