import type { FC } from "react";
import { Trash2 } from "lucide-react";
import type { PeakSeasonRate } from "@/types";
import { PEAK_RATE_CARD_CLASS } from "./peakRateStyles";
import { PeakRateMeta } from "./PeakRateMeta";
import { PeakRateValue } from "./PeakRateValue";

type PeakRateItemProps = { rate: PeakSeasonRate; onDeleteRate: (id: string) => void };

export const PeakRateItem: FC<PeakRateItemProps> = ({ rate, onDeleteRate }) => (
  <div className={PEAK_RATE_CARD_CLASS}>
    <PeakRateMeta rate={rate} />
    <div className="flex items-center gap-3">
      <PeakRateValue rate={rate} />
      <button onClick={() => onDeleteRate(rate.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition" title="Hapus Aturan"><Trash2 size={13} /></button>
    </div>
  </div>
);
