import type { FC } from "react";
import { SortControls } from "./SortControls";
import { SortResultCount } from "./SortResultCount";
import type { SortFilterBarProps } from "./sortFilterTypes";

export const SortResultsHeader: FC<{ props: SortFilterBarProps }> = ({ props }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 mb-4">
    <SortResultCount count={props.resultCount} label={props.resultLabel || "hasil"} />
    <SortControls props={props} />
  </div>
);
