import type { FC } from "react";
import SearchForm from "@/components/user/SearchForm";
import type { FilterValues } from "@/stores/filterStore";
import { HomeFilterActions } from "./HomeFilterActions";
import { HomeFilterChips } from "./HomeFilterChips";
import { HomeSortBar } from "./HomeSortBar";

interface HomeFilterPanelProps {
  activeFilters: FilterValues;
  currentOrder: "asc" | "desc";
  currentSort: string;
  hasFilterChanges: boolean;
  totalCount: number;
}

export const HomeFilterPanel: FC<HomeFilterPanelProps> = (props) => (
  <div className="mb-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 md:p-5">
    <div className="space-y-5">
      <SearchForm variant="embedded" />
      <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
        <HomeSortBar activeFilters={props.activeFilters} currentOrder={props.currentOrder} currentSort={props.currentSort} totalCount={props.totalCount} />
        <HomeFilterActions hasFilterChanges={props.hasFilterChanges} />
        <HomeFilterChips activeFilters={props.activeFilters} />
      </div>
    </div>
  </div>
);
