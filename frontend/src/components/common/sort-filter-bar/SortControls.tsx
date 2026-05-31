import type { FC } from "react";
import { PropertyFilterDropdown } from "@/components/user/PropertyFilterDropdown";
import { SortDropdownContent } from "./SortDropdownContent";
import { SortLabel } from "./SortLabel";
import { SORT_ICON_MAP } from "./sortIcons";
import type { SortFilterBarProps } from "./sortFilterTypes";
import { useSortDropdownState } from "./useSortDropdownState";

export const SortControls: FC<{ props: SortFilterBarProps }> = ({ props }) => {
  const state = useSortDropdownState(props.currentSort, props.onChange);
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <PropertyFilterDropdown />
      <div className="hidden sm:block w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />
      <SortLabel />
      {props.sortGroups.map((group) => <SortDropdownContent key={group.key} group={group} isActive={props.currentSort === group.key} isOpen={state.openGroup === group.key} currentOrder={props.currentOrder} icon={group.icon ? SORT_ICON_MAP[group.icon] : undefined} onGroupClick={state.handleGroupClick} onSubOptionClick={state.handleSubOption} onElement={state.setDropdownRef(group.key)} />)}
    </div>
  );
};
