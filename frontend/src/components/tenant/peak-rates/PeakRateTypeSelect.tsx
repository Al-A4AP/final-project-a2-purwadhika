import type { FC } from "react";
import { PEAK_RATE_INPUT_CLASS } from "./peakRateStyles";
import type { PeakRateFormProps } from "./peakRateTypes";

export const PeakRateTypeSelect: FC<Pick<PeakRateFormProps, "peakForm" | "onFormChange">> = ({ peakForm, onFormChange }) => (
  <div>
    <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">Tipe Penyesuaian</label>
    <select value={peakForm.rate_type} onChange={(event) => onFormChange({ ...peakForm, rate_type: event.target.value })} className={PEAK_RATE_INPUT_CLASS}>
      <option value="PERCENTAGE">Persentase (%)</option>
      <option value="NOMINAL">Nominal Rupiah (Rp)</option>
    </select>
  </div>
);
