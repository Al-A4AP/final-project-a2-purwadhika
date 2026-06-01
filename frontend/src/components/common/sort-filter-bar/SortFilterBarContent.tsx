import type { FC } from "react";
import { SortResultsHeader } from "./SortResultsHeader";
import type { SortFilterBarProps } from "./sortFilterTypes";

export const SortFilterBarContent: FC<SortFilterBarProps> = (props) => (
  <div className="mb-6">
    <SortResultsHeader props={props} />
  </div>
);
