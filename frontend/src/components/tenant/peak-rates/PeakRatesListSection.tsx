import type { FC } from "react";
import type { PeakSeasonRate } from "@/types";
import { PeakRatesList } from "./PeakRatesList";

type PeakRatesListSectionProps = {
  peakRates: PeakSeasonRate[];
  onDeleteRate: (id: string) => void;
};

export const PeakRatesListSection: FC<PeakRatesListSectionProps> = ({ peakRates, onDeleteRate }) => (
  <div className="space-y-2">
    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Peak Season Aktif ({peakRates.length})</h3>
    <PeakRatesList peakRates={peakRates} onDeleteRate={onDeleteRate} />
  </div>
);
