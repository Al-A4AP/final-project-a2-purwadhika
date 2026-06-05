import type { FC } from "react";
import { PropertyInlineFilters } from "@/components/user/PropertyInlineFilters";
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
  layout?: HomeFilterPanelLayout;
  onApplied?: () => void;
  showInlinePropertyFilters?: boolean;
  totalCount: number;
}

export const HomeFilterPanel: FC<HomeFilterPanelProps> = (props) => (
  <div className={getPanelClass(props.layout)}>
    <div className="space-y-5">
      <SearchForm layout={getSearchLayout(props.layout)} onSubmitted={props.onApplied} variant="embedded" />
      <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
        {props.showInlinePropertyFilters && <InlineFilterSection onApplied={props.onApplied} />}
        <HomeSortBar activeFilters={props.activeFilters} currentOrder={props.currentOrder} currentSort={props.currentSort} layout={getSortLayout(props.layout)} showFilterButton={!props.showInlinePropertyFilters} totalCount={props.totalCount} />
        <HomeFilterActions hasFilterChanges={props.hasFilterChanges} onApplied={props.onApplied} />
        <HomeFilterChips activeFilters={props.activeFilters} />
      </div>
    </div>
  </div>
);

const InlineFilterSection: FC<{ onApplied?: () => void }> = ({ onApplied }) => (
  <div className="mb-5 border-b border-slate-100 pb-5 dark:border-slate-800">
    <PropertyInlineFilters onApplied={onApplied} />
  </div>
);

const getPanelClass = (layout: HomeFilterPanelLayout = "default") =>
  layout === "sidebar" ? SIDEBAR_PANEL_CLASS : DEFAULT_PANEL_CLASS;

const getSearchLayout = (layout?: HomeFilterPanelLayout) =>
  layout === "sidebar" ? "stacked" : "responsive";

const getSortLayout = (layout?: HomeFilterPanelLayout) =>
  layout === "sidebar" ? "stacked" : "default";

type HomeFilterPanelLayout = "default" | "sidebar";

const DEFAULT_PANEL_CLASS = "mb-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 md:p-5";
const SIDEBAR_PANEL_CLASS = "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 md:p-5";
