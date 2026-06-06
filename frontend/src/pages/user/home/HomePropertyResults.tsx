import type { FC } from "react";
import PropertyGrid from "@/components/user/PropertyGrid";
import { useFilterStore, type FilterValues } from "@/stores/filterStore";
import type { Property } from "@/types";

interface HomePropertyResultsProps {
  activeFilters: FilterValues;
  currentOrder: "asc" | "desc";
  currentSort: string;
  desktopCols?: 3 | 4;
  error: string | null;
  loading: boolean;
  properties: Property[];
  propertyLimit: number;
  retry: () => void;
  totalCount: number;
  totalPages: number;
}

export const HomePropertyResults: FC<HomePropertyResultsProps> = (props) => {
  const filters = useFilterStore();
  return <PropertyGrid properties={props.properties} loading={props.loading} error={props.error} onRetry={props.retry} totalCount={props.totalCount} city={props.activeFilters.city || ""} checkIn={props.activeFilters.check_in_date} checkOut={props.activeFilters.check_out_date} sort={props.currentSort} order={props.currentOrder} currentPage={props.activeFilters.page} totalPages={props.totalPages} pageSize={props.propertyLimit} desktopCols={props.desktopCols} onPageChange={(page) => applyPage(filters, page)} />;
};

const applyPage = (filters: ReturnType<typeof useFilterStore.getState>, page: number) => {
  filters.setPage(page);
  filters.applyFilters();
};
