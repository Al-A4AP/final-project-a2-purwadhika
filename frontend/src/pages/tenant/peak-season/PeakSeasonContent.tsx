import type { FC } from "react";
import { PeakSeasonFilters } from "./PeakSeasonFilters";
import { PeakSeasonHeader } from "./PeakSeasonHeader";
import { PeakSeasonPropertyList } from "./PeakSeasonPropertyList";
import type { PeakSeasonPageState } from "./peakSeasonTypes";

export const PeakSeasonContent: FC<{ state: PeakSeasonPageState }> = ({ state }) => (
  <div className="min-h-screen bg-slate-50 px-4 py-8 pb-24 dark:bg-slate-900 md:p-10">
    <div className="mx-auto max-w-7xl space-y-8">
      <PeakSeasonHeader />
      <PeakSeasonFilters state={state} />
      <PeakSeasonPropertyList state={state} />
    </div>
  </div>
);
