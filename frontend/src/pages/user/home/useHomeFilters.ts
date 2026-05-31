import { useMemo } from "react";
import { useFilterStore, type FilterValues } from "@/stores/filterStore";

type FilterStoreState = ReturnType<typeof useFilterStore.getState>;

export const useActiveHomeFilters = (filters: FilterStoreState): FilterValues =>
  useMemo(() => {
    const raw = filters.activeFilters || filters.getFilterValues();
    if (filters.appliedAt === 0 && raw.sort === "popularity") {
      return { ...raw, sort: "created_at", order: "desc" };
    }
    return raw;
  }, [filters]);

export const useHasFilterChanges = (filters: FilterStoreState, activeFilters: FilterValues) =>
  useMemo(
    () => JSON.stringify(filters.getFilterValues()) !== JSON.stringify(activeFilters),
    [filters, activeFilters],
  );
