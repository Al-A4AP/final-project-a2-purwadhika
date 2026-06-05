import type { FC } from "react";
import { useHomePageState } from "./home/useHomePageState";
import { SlidersHorizontal } from "lucide-react";
import { HomeFilterPanel } from "./home/HomeFilterPanel";
import { HomePropertyResults } from "./home/HomePropertyResults";

const ExplorePage: FC = () => {
  const { activeFilters, hasFilterChanges, propertyLimit, propertyState } = useHomePageState();
  const currentOrder = (activeFilters.order as "asc" | "desc") || "desc";
  const currentSort = activeFilters.sort || "created_at";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-16">
      {/* Page Header & Sticky Search Bar */}
      <div className="sticky top-16 z-40 border-b border-slate-200 bg-white/95 pb-4 pt-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Jelajahi Properti</h1>
              <p className="text-sm text-slate-500">Temukan akomodasi terbaik di seluruh Indonesia.</p>
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 sm:hidden">
              <SlidersHorizontal className="h-4 w-4" /> Filter & Urutkan
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Desktop Filter Panel */}
          <div className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-44">
              <HomeFilterPanel 
                activeFilters={activeFilters} 
                currentOrder={currentOrder} 
                currentSort={currentSort} 
                hasFilterChanges={hasFilterChanges} 
                totalCount={propertyState.totalCount} 
              />
            </div>
          </div>
          
          {/* Property Results */}
          <div className="flex-1 min-w-0">
            <HomePropertyResults 
              {...propertyState} 
              activeFilters={activeFilters} 
              currentOrder={currentOrder} 
              currentSort={currentSort} 
              propertyLimit={propertyLimit} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
