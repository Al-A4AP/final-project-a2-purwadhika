import type { FC } from "react";
import { PEAK_RATE_INPUT_CLASS } from "./peakRateStyles";
import type { PeakRateFormProps } from "./peakRateTypes";

export const PeakRateDescriptionInput: FC<Pick<PeakRateFormProps, "peakForm" | "onFormChange">> = ({ peakForm, onFormChange }) => (
  <div className="col-span-2">
    <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">Nama/Deskripsi (opsional)</label>
    <input type="text" placeholder="cth. Libur Lebaran, Tahun Baru" value={peakForm.description} onChange={(event) => onFormChange({ ...peakForm, description: event.target.value })} className={PEAK_RATE_INPUT_CLASS} />
  </div>
);
