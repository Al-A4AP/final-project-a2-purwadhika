import type { FC } from "react";
import { FilterActionBar } from "./FilterActionBar";
import { SortResultsHeader } from "./SortResultsHeader";
import type { SortFilterBarProps } from "./sortFilterTypes";

export const SortFilterBarContent: FC<SortFilterBarProps> = (props) => (
  <div className="mb-6">
    <FilterActionBar props={props} />
    <SortResultsHeader props={props} />
  </div>
);
