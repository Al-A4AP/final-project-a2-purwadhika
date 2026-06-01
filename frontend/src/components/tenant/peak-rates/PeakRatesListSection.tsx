import type { FC } from "react";
import type { PeakSeasonRate } from "@/types";
import { PeakRatesList } from "./PeakRatesList";

type PeakRatesListSectionProps = {
  editingRateId: string | null;
  peakRates: PeakSeasonRate[];
  onDeleteRate: (id: string) => void;
  onEditRate: (rate: PeakSeasonRate) => void;
};

export const PeakRatesListSection: FC<PeakRatesListSectionProps> = ({ editingRateId, peakRates, onDeleteRate, onEditRate }) => (
  <div className="space-y-2">
    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Peak Season Aktif ({peakRates.length})</h3>
    <PeakRatesList editingRateId={editingRateId} peakRates={peakRates} onDeleteRate={onDeleteRate} onEditRate={onEditRate} />
  </div>
);
