import type { FC } from "react";
import type { PeakSeasonRate } from "@/types";
import { formatPeakRateDate, formatPeakRateValue } from "./peakRateFormat";

export const PeakRateItem: FC<{ rate: PeakSeasonRate }> = ({ rate }) => (
  <div className="flex justify-between rounded border bg-orange-50 px-3 py-1.5 text-xs dark:border-orange-950/20 dark:bg-orange-900/10">
    <span>{formatPeakRateDate(rate.start_date)} - {formatPeakRateDate(rate.end_date)}</span>
    <span className="font-medium text-orange-600 dark:text-orange-400">{formatPeakRateValue(rate)}</span>
  </div>
);
