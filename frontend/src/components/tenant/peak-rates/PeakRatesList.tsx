import type { FC } from "react";
import type { PeakSeasonRate } from "@/types";
import { PeakRateItem } from "./PeakRateItem";

type PeakRatesListProps = {
  peakRates: PeakSeasonRate[];
  onDeleteRate: (id: string) => void;
};

export const PeakRatesList: FC<PeakRatesListProps> = ({ peakRates, onDeleteRate }) =>
  peakRates.length === 0 ? (
    <p className="text-xs text-gray-500 dark:text-gray-400 italic">Belum ada peak season yang diatur untuk kamar ini.</p>
  ) : (
    <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
      {peakRates.map((rate) => <PeakRateItem key={rate.id} rate={rate} onDeleteRate={onDeleteRate} />)}
    </div>
  );
