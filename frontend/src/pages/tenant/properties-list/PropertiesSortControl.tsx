import type { FC } from "react";
import SortFilterBar from "@/components/common/SortFilterBar";
import { tenantSortGroups } from "./propertiesSortGroups";

interface PropertiesSortControlProps {
  hasProperties: boolean;
  onChange: (sort: string, order: "asc" | "desc") => void;
  sortKey: string;
  sortOrder: "asc" | "desc";
  total: number;
}

export const PropertiesSortControl: FC<PropertiesSortControlProps> = (props) => (
  props.hasProperties ? <SortFilterBar sortGroups={tenantSortGroups} currentSort={props.sortKey} currentOrder={props.sortOrder} onChange={props.onChange} resultCount={props.total} resultLabel="properti" /> : null
);
