import type { FC } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { PeakSeasonRate } from "@/types";
import { PEAK_RATE_CARD_CLASS } from "./peakRateStyles";
import { PeakRateMeta } from "./PeakRateMeta";
import { PeakRateValue } from "./PeakRateValue";

type PeakRateItemProps = {
  isEditing: boolean;
  rate: PeakSeasonRate;
  onDeleteRate: (id: string) => void;
  onEditRate: (rate: PeakSeasonRate) => void;
};

export const PeakRateItem: FC<PeakRateItemProps> = ({ isEditing, rate, onDeleteRate, onEditRate }) => (
  <div className={`${PEAK_RATE_CARD_CLASS} ${isEditing ? "ring-2 ring-orange-300" : ""}`}>
    <PeakRateMeta rate={rate} />
    <div className="flex items-center gap-3">
      <PeakRateValue rate={rate} />
      <button onClick={() => onEditRate(rate)} className="rounded p-1.5 text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-950/20" title="Edit Aturan"><Pencil size={13} /></button>
      <button onClick={() => onDeleteRate(rate.id)} className="rounded p-1.5 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/20" title="Hapus Aturan"><Trash2 size={13} /></button>
    </div>
  </div>
);
