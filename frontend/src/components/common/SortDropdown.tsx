import type { FC } from "react";
import { SortDropdownContent } from "./sort-filter-bar/SortDropdownContent";
import type { SortDropdownProps } from "./sort-filter-bar/sortFilterTypes";

export const SortDropdown: FC<SortDropdownProps> = (props) => (
  <SortDropdownContent {...props} />
);
