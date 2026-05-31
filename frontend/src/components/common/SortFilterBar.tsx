import type { FC } from "react";
import { SortFilterBarContent } from "./sort-filter-bar/SortFilterBarContent";
import type { SortFilterBarProps } from "./sort-filter-bar/sortFilterTypes";

export type { SortGroup, SortSubOption } from "./sort-filter-bar/sortFilterTypes";

const SortFilterBar: FC<SortFilterBarProps> = (props) => (
  <SortFilterBarContent {...props} />
);

export default SortFilterBar;
