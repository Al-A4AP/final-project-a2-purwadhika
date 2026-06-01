import type { FC } from "react";
import type { DateRange } from "react-day-picker";
import { isAvailabilityRangeComplete } from "@/hooks/rooms/availabilityRange";

interface AvailabilityFooterProps {
  isSaving: boolean;
  range?: DateRange;
  onClose: () => void;
  onConfirm: () => void;
}

export const AvailabilityFooter: FC<AvailabilityFooterProps> = (props) => (
  <div className="flex justify-end gap-2">
    <button onClick={props.onClose} className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-300">Batal</button>
    <button onClick={props.onConfirm} disabled={props.isSaving || !isAvailabilityRangeComplete(props.range)} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">{props.isSaving ? "Menyimpan..." : "Konfirmasi"}</button>
  </div>
);
