import type { FC } from "react";
import { SortDropdownOption } from "./SortDropdownOption";
import type { SortDropdownProps } from "./sortFilterTypes";

export const SortDropdownMenu: FC<SortDropdownProps> = (props) => (
  <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-40 origin-top-left animate-fade-in">
    {props.group.options.map((sub) => <SortDropdownOption key={sub.order} group={props.group} sub={sub} props={props} />)}
  </div>
);
