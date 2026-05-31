import type { ReactNode } from "react";

export type SortOrder = "asc" | "desc";

export type SortSubOption = {
  order: SortOrder;
  label: string;
};

export type SortIconKey = "trending" | "star" | "price" | "clock" | "bed" | "alpha";

export type SortGroup = {
  key: string;
  label: string;
  icon?: SortIconKey;
  options: [SortSubOption, SortSubOption];
};

export type SortFilterBarProps = {
  sortGroups: SortGroup[];
  currentSort: string;
  currentOrder: SortOrder;
  onChange: (sort: string, order: SortOrder) => void;
  resultCount?: number;
  resultLabel?: string;
  hasFilterChanges?: boolean;
  onApplyFilters?: () => void;
  onResetFilters?: () => void;
};

export type SortDropdownProps = {
  group: SortGroup;
  isActive: boolean;
  isOpen: boolean;
  currentOrder: SortOrder;
  icon?: ReactNode;
  onGroupClick: (group: SortGroup) => void;
  onSubOptionClick: (group: SortGroup, sub: SortSubOption) => void;
  onElement?: (el: HTMLDivElement | null) => void;
};
