import type { FC } from "react";
import type { FilterValues } from "@/stores/filterStore";
import type { Property } from "@/types";
import { HomeFilterChips } from "./HomeFilterChips";
import { HomePropertyResults } from "./HomePropertyResults";
import { HomeSortBar } from "./HomeSortBar";

interface HomeResultsSectionProps {
  activeFilters: FilterValues;
  error: string | null;
  hasFilterChanges: boolean;
  loading: boolean;
  properties: Property[];
  propertyLimit: number;
  retry: () => void;
  totalCount: number;
  totalPages: number;
}

export const HomeResultsSection: FC<HomeResultsSectionProps> = (props) => {
  const currentOrder = (props.activeFilters.order as "asc" | "desc") || "desc";
  const currentSort = props.activeFilters.sort || "created_at";
  return (
    <section id="results-section" className="max-w-7xl mx-auto px-4 py-16 scroll-mt-24">
      <HomeSortBar {...props} currentOrder={currentOrder} currentSort={currentSort} />
      <HomeFilterChips activeFilters={props.activeFilters} />
      <HomePropertyResults {...props} currentOrder={currentOrder} currentSort={currentSort} />
    </section>
  );
};
