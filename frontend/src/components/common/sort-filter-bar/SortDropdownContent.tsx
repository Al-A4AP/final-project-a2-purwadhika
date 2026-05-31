import type { FC } from "react";
import { SortDropdownButton } from "./SortDropdownButton";
import { SortDropdownMenu } from "./SortDropdownMenu";
import type { SortDropdownProps } from "./sortFilterTypes";

export const SortDropdownContent: FC<SortDropdownProps> = ({ onElement, ...props }) => (
  <div className="relative inline-block text-left" ref={onElement}>
    <SortDropdownButton {...props} />
    {props.isOpen && <SortDropdownMenu {...props} />}
  </div>
);
