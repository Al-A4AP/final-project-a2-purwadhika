import type { FC } from "react";
import { PEAK_RATE_INPUT_CLASS } from "./peakRateStyles";

type PeakRateDateInputProps = { label: string; value: string; onChange: (value: string) => void; min?: string };

export const PeakRateDateInput: FC<PeakRateDateInputProps> = ({ label, value, onChange, min }) => (
  <div>
    <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
    <input type="date" required value={value} min={min} onChange={(event) => onChange(event.target.value)} className={PEAK_RATE_INPUT_CLASS} />
  </div>
);
