import type { FC } from "react";
import { ActiveCityNotice } from "./ActiveCityNotice";
import { FilterActionBar } from "./FilterActionBar";
import { SortResultsHeader } from "./SortResultsHeader";
import type { SortFilterBarProps } from "./sortFilterTypes";

export const SortFilterBarContent: FC<SortFilterBarProps> = (props) => (
  <div className="mb-6">
    <FilterActionBar props={props} />
    <ActiveCityNotice activeCity={props.activeCity} onClearCity={props.onClearCity} />
    <SortResultsHeader props={props} />
  </div>
);
