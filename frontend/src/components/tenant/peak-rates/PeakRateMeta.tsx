import type { FC } from "react";
import type { PeakSeasonRate } from "@/types";

const formatDate = (date: string) => new Date(date).toLocaleDateString("id-ID");

export const PeakRateMeta: FC<{ rate: PeakSeasonRate }> = ({ rate }) => (
  <div>
    <p className="font-semibold text-gray-900 dark:text-white">{rate.description || "Peak Season Rate"}</p>
    <p className="text-gray-500 dark:text-gray-400 text-[10px] mt-0.5">{formatDate(rate.start_date)} - {formatDate(rate.end_date)}</p>
  </div>
);
