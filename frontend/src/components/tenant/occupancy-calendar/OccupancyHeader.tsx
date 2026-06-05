import type { FC } from "react";
import { MONTH_NAMES } from "./monthNames";
import { MonthNavButton } from "./MonthNavButton";

export const OccupancyHeader: FC<{ month: number; onNext: () => void; onPrev: () => void; year: number }> = (props) => (
  <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-start">
    <MonthNavButton direction="prev" onClick={props.onPrev} />
    <span className="min-w-[120px] text-center text-lg font-bold text-slate-900 dark:text-white">
      {MONTH_NAMES[props.month]} {props.year}
    </span>
    <MonthNavButton direction="next" onClick={props.onNext} />
  </div>
);
