import type { FC } from "react";
import { Calendar } from "lucide-react";
import { MONTH_NAMES } from "./monthNames";
import { MonthNavButton } from "./MonthNavButton";

export const OccupancyHeader: FC<{ month: number; onNext: () => void; onPrev: () => void; year: number }> = (props) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-2"><Calendar className="text-red-600" size={24} /><h2 className="text-lg font-bold text-gray-900 dark:text-white">Kalender Okupansi Kamar</h2></div>
    <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start sm:gap-4">
      <MonthNavButton direction="prev" onClick={props.onPrev} />
      <span className="text-md font-semibold text-gray-800 dark:text-gray-200">{MONTH_NAMES[props.month]} {props.year}</span>
      <MonthNavButton direction="next" onClick={props.onNext} />
    </div>
  </div>
);
