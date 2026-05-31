import type { FC } from "react";
import type { PaginationMeta, TenantProperty } from "@/types";
import { PropertiesSearchBar } from "./PropertiesSearchBar";
import { PropertiesSortControl } from "./PropertiesSortControl";

interface PropertiesToolbarProps {
  filters: { applySearch: () => void; searchQuery: string; setSearchQuery: (value: string) => void; setSort: (sort: string, order: "asc" | "desc") => void; sortKey: string; sortOrder: "asc" | "desc" };
  pagination: PaginationMeta;
  properties: TenantProperty[];
}

export const PropertiesToolbar: FC<PropertiesToolbarProps> = ({ filters, pagination, properties }) => (
  <div className="flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
    <PropertiesSearchBar applySearch={filters.applySearch} searchQuery={filters.searchQuery} setSearchQuery={filters.setSearchQuery} />
    <PropertiesSortControl hasProperties={properties.length > 0} sortKey={filters.sortKey} sortOrder={filters.sortOrder} onChange={filters.setSort} total={pagination.total} />
  </div>
);
