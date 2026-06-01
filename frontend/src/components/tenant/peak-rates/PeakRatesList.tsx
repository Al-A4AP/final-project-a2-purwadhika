import type { FC } from "react";
import type { PeakSeasonRate } from "@/types";
import { PeakRateItem } from "./PeakRateItem";

type PeakRatesListProps = {
  editingRateId: string | null;
  peakRates: PeakSeasonRate[];
  onDeleteRate: (id: string) => void;
  onEditRate: (rate: PeakSeasonRate) => void;
};

export const PeakRatesList: FC<PeakRatesListProps> = ({ editingRateId, peakRates, onDeleteRate, onEditRate }) =>
  peakRates.length === 0 ? (
    <p className="text-xs text-gray-500 dark:text-gray-400 italic">Belum ada peak season yang diatur untuk kamar ini.</p>
  ) : (
    <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
      {peakRates.map((rate) => <PeakRateItem key={rate.id} rate={rate} isEditing={editingRateId === rate.id} onEditRate={onEditRate} onDeleteRate={onDeleteRate} />)}
    </div>
  );
