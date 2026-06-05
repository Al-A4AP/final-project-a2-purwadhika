import type { FC } from "react";
import { SortControls } from "./SortControls";
import { SortResultCount } from "./SortResultCount";
import type { SortFilterBarProps } from "./sortFilterTypes";

export const SortResultsHeader: FC<{ props: SortFilterBarProps }> = ({ props }) => (
  <div className={getHeaderClass(props.layout)}>
    <SortResultCount count={props.resultCount} label={props.resultLabel || "hasil"} />
    <SortControls props={props} />
  </div>
);

const getHeaderClass = (layout: SortFilterBarProps["layout"]) =>
  layout === "stacked"
    ? "mb-4 flex flex-col gap-3 border-b pb-3 dark:border-slate-800"
    : "mb-4 flex flex-col justify-between gap-3 border-b pb-3 dark:border-slate-800 sm:flex-row sm:items-center";
