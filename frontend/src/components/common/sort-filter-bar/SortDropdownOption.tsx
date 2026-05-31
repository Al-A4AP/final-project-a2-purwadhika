import type { FC } from "react";
import { getDropdownOptionClass } from "./sortDropdownStyles";
import type { SortDropdownProps, SortGroup, SortSubOption } from "./sortFilterTypes";

type SortDropdownOptionProps = {
  group: SortGroup;
  sub: SortSubOption;
  props: SortDropdownProps;
};

export const SortDropdownOption: FC<SortDropdownOptionProps> = ({ group, sub, props }) => {
  const active = props.isActive && props.currentOrder === sub.order;
  return <button onClick={() => props.onSubOptionClick(group, sub)} className={getDropdownOptionClass(active)}>{sub.label}</button>;
};
