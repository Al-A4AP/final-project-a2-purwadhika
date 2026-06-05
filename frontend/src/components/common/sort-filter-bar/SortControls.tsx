import type { FC } from "react";
import { PropertyFilterDropdown } from "@/components/user/PropertyFilterDropdown";
import { SortDropdownContent } from "./SortDropdownContent";
import { SortLabel } from "./SortLabel";
import { SORT_ICON_MAP } from "./sortIcons";
import type { SortFilterBarProps } from "./sortFilterTypes";
import { useSortDropdownState } from "./useSortDropdownState";

export const SortControls: FC<{ props: SortFilterBarProps }> = ({ props }) => {
  const state = useSortDropdownState(props.currentSort, props.onChange);
  const showFilterButton = props.showFilterButton !== false;
  return (
    <div className={getControlsClass(props.layout)}>
      {showFilterButton && <PropertyFilterDropdown />}
      {showFilterButton && <div className="hidden h-5 w-px bg-slate-200 dark:bg-slate-800 sm:block" />}
      <SortLabel />
      <div className={getButtonsClass(props.layout)}>
        {props.sortGroups.map((group) => <SortDropdownContent key={group.key} group={group} isActive={props.currentSort === group.key} isOpen={state.openGroup === group.key} currentOrder={props.currentOrder} icon={group.icon ? SORT_ICON_MAP[group.icon] : undefined} onGroupClick={state.handleGroupClick} onSubOptionClick={state.handleSubOption} onElement={state.setDropdownRef(group.key)} />)}
      </div>
    </div>
  );
};

const getControlsClass = (layout: SortFilterBarProps["layout"]) =>
  layout === "stacked" ? "flex w-full flex-col gap-3" : "flex w-full flex-wrap items-center gap-3 sm:w-auto";

const getButtonsClass = (layout: SortFilterBarProps["layout"]) =>
  layout === "stacked"
    ? "grid gap-2 [&>div]:w-full [&_button]:w-full [&_button]:justify-center"
    : "flex flex-wrap items-center gap-3";
