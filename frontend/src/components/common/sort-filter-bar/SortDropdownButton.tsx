import type { FC } from "react";
import { ChevronDown } from "lucide-react";
import { getDropdownButtonClass } from "./sortDropdownStyles";
import type { SortDropdownProps } from "./sortFilterTypes";

const getActiveSubLabel = (props: SortDropdownProps) =>
  props.isActive ? props.group.options.find((option) => option.order === props.currentOrder)?.label : null;

export const SortDropdownButton: FC<SortDropdownProps> = (props) => (
  <button onClick={() => props.onGroupClick(props.group)} className={getDropdownButtonClass(props.isActive, props.isOpen)}>
    {props.icon}
    {getActiveSubLabel(props) || props.group.label}
    <ChevronDown size={11} className={`transition-transform duration-200 ${props.isOpen ? "rotate-180" : ""}`} />
  </button>
);
