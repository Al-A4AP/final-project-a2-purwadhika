import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createFilterStoreState } from "./filter/filterStoreState";
import type { FilterStore } from "./filter/filterTypes";

export type { FilterValues } from "./filter/filterTypes";

export const useFilterStore = create<FilterStore>()(
  persist(
    (set, get) => createFilterStoreState(set, get),
    { name: "property-filter-storage" },
  ),
);
