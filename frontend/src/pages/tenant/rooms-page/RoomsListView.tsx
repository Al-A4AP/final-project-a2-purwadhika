import type { FC } from "react";
import { RoomsListDesktop } from "./RoomsListDesktop";
import { RoomsListMobile } from "./RoomsListMobile";
import type { RoomsListViewProps } from "./roomsListTypes";

export const RoomsListView: FC<RoomsListViewProps> = (props) => (
  <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <RoomsListMobile {...props} />
    <RoomsListDesktop {...props} />
  </div>
);
