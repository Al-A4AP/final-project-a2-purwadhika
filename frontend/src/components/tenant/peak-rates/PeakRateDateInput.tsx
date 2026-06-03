import type { FC } from "react";
import { CustomDatePickerPopup } from "@/components/common/CustomDatePickerPopup";
import { PEAK_RATE_INPUT_CLASS } from "./peakRateStyles";

type PeakRateDateInputProps = { label: string; value: string; onChange: (value: string) => void; min?: string };

export const PeakRateDateInput: FC<PeakRateDateInputProps> = ({ label, value, onChange, min }) => (
  <div>
    <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
    <CustomDatePickerPopup min={min} value={value} onChange={onChange} className={PEAK_RATE_INPUT_CLASS} />
  </div>
);
