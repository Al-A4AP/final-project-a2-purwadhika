import type { FC } from "react";
import SortFilterBar from "@/components/common/SortFilterBar";
import type { SortFilterLayout } from "@/components/common/sort-filter-bar/sortFilterTypes";
import { useFilterStore, type FilterValues } from "@/stores/filterStore";
import { HOME_SORT_GROUPS } from "@/hooks/user/home/homeSortGroups";

interface HomeSortBarProps {
  activeFilters: FilterValues;
  currentOrder: "asc" | "desc";
  currentSort: string;
  layout?: SortFilterLayout;
  showFilterButton?: boolean;
  totalCount: number;
}

export const HomeSortBar: FC<HomeSortBarProps> = ({ activeFilters, currentOrder, currentSort, layout, showFilterButton, totalCount }) => {
  const filters = useFilterStore();
  return <SortFilterBar sortGroups={HOME_SORT_GROUPS} currentSort={currentSort} currentOrder={currentOrder} layout={layout} onChange={(sort, order) => applySort(filters, sort, order)} resultCount={totalCount} resultLabel={activeFilters.city ? `properti di ${activeFilters.city}` : "properti terbaru"} showFilterButton={showFilterButton} />;
};

type FilterStoreState = ReturnType<typeof useFilterStore.getState>;

const applySort = (filters: FilterStoreState, sort: string, order: "asc" | "desc") => {
  filters.setSort(sort);
  filters.setOrder(order);
  filters.applyFilters();
};
