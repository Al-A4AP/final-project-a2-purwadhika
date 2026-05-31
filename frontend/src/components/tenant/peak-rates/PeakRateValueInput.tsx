import type { FC } from "react";
import { PEAK_RATE_INPUT_CLASS } from "./peakRateStyles";
import type { PeakRateFormProps } from "./peakRateTypes";

const getValuePlaceholder = (rateType: string) => (rateType === "PERCENTAGE" ? "10" : "100000");

export const PeakRateValueInput: FC<Pick<PeakRateFormProps, "peakForm" | "onFormChange">> = ({ peakForm, onFormChange }) => (
  <div>
    <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">Nilai Tambahan</label>
    <input type="number" min="0" required placeholder={getValuePlaceholder(peakForm.rate_type)} value={peakForm.rate_value} onChange={(event) => onFormChange({ ...peakForm, rate_value: event.target.value })} className={PEAK_RATE_INPUT_CLASS} />
  </div>
);
