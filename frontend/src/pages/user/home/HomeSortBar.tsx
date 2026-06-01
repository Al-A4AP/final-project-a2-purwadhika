import type { FC } from "react";
import SortFilterBar from "@/components/common/SortFilterBar";
import { useFilterStore, type FilterValues } from "@/stores/filterStore";
import { HOME_SORT_GROUPS } from "./homeSortGroups";

interface HomeSortBarProps {
  activeFilters: FilterValues;
  currentOrder: "asc" | "desc";
  currentSort: string;
  totalCount: number;
}

export const HomeSortBar: FC<HomeSortBarProps> = ({ activeFilters, currentOrder, currentSort, totalCount }) => {
  const filters = useFilterStore();
  return <SortFilterBar sortGroups={HOME_SORT_GROUPS} currentSort={currentSort} currentOrder={currentOrder} onChange={(sort, order) => applySort(filters, sort, order)} resultCount={totalCount} resultLabel={activeFilters.city ? `properti di ${activeFilters.city}` : "properti terbaru"} />;
};

type FilterStoreState = ReturnType<typeof useFilterStore.getState>;

const applySort = (filters: FilterStoreState, sort: string, order: "asc" | "desc") => {
  filters.setSort(sort);
  filters.setOrder(order);
  filters.applyFilters();
};
