import type { FC } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useExplorePageState, type ExplorePageState } from "@/hooks/user/explore/useExplorePageState";
import { HomeFilterPanel } from "./home/HomeFilterPanel";
import { HomePropertyResults } from "./home/HomePropertyResults";

type ExploreState = ExplorePageState;

const ExplorePage: FC = () => <ExplorePageView state={useExplorePageState()} />;

const ExplorePageView: FC<{ state: ExploreState }> = ({ state }) => (
  <div className="min-h-screen bg-slate-50 pb-16 dark:bg-slate-900">
    <ExploreHeader state={state} />
    <ExploreMain state={state} />
  </div>
);

const ExploreHeader: FC<{ state: ExploreState }> = ({ state }) => (
  <div className="sticky top-16 z-40 border-b border-slate-200 bg-white/95 pb-4 pt-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
    <div className="mx-auto max-w-7xl px-4">
      <HeaderRow state={state} />
      {state.filtersOpen && <MobileFilterPanel state={state} />}
    </div>
  </div>
);

const HeaderRow: FC<{ state: ExploreState }> = ({ state }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Jelajahi Properti</h1>
      <p className="text-sm text-slate-500">Temukan akomodasi terbaik di seluruh Indonesia.</p>
    </div>
    <MobileFilterButton isOpen={state.filtersOpen} onClick={state.toggleFilters} />
  </div>
);

const MobileFilterButton: FC<{ isOpen: boolean; onClick: () => void }> = ({ isOpen, onClick }) => (
  <button onClick={onClick} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 lg:hidden">
    {isOpen ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
    {isOpen ? "Tutup Filter" : "Filter & Urutkan"}
  </button>
);

const ExploreMain: FC<{ state: ExploreState }> = ({ state }) => (
  <div className="mx-auto max-w-7xl px-4 py-8">
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <DesktopFilterPanel state={state} />
      <PropertyResults state={state} />
    </div>
  </div>
);

const DesktopFilterPanel: FC<{ state: ExploreState }> = ({ state }) => (
  <div className="hidden shrink-0 lg:block lg:w-88 xl:w-96">
    <div className="sticky top-36">
      <ExploreFilterPanel state={state} />
    </div>
  </div>
);

const ExploreFilterPanel: FC<{ state: ExploreState }> = ({ state }) => (
  <HomeFilterPanel
    activeFilters={state.activeFilters}
    currentOrder={state.currentOrder}
    currentSort={state.currentSort}
    hasFilterChanges={state.hasFilterChanges}
    layout="sidebar"
    onApplied={state.closeFilters}
    showInlinePropertyFilters
    totalCount={state.propertyState.totalCount}
  />
);

const MobileFilterPanel: FC<{ state: ExploreState }> = ({ state }) => (
  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:hidden">
    <ExploreFilterPanel state={state} />
  </div>
);

const PropertyResults: FC<{ state: ExploreState }> = ({ state }) => (
  <div id="results-section" className="min-w-0 flex-1 scroll-mt-40">
    <HomePropertyResults
      {...state.propertyState}
      activeFilters={state.activeFilters}
      currentOrder={state.currentOrder}
      currentSort={state.currentSort}
      desktopCols={3}
      propertyLimit={state.propertyLimit}
    />
  </div>
);

export default ExplorePage;
