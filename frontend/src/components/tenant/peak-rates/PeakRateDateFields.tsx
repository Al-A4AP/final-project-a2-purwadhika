import type { FC } from "react";
import { PeakRateDateInput } from "./PeakRateDateInput";
import type { PeakRateFormProps } from "./peakRateTypes";

export const PeakRateDateFields: FC<PeakRateFormProps> = ({ peakForm, onFormChange }) => (
  <>
    <PeakRateDateInput label="Tanggal Mulai" value={peakForm.start_date} onChange={(value) => onFormChange({ ...peakForm, start_date: value })} />
    <PeakRateDateInput label="Tanggal Selesai" value={peakForm.end_date} min={peakForm.start_date} onChange={(value) => onFormChange({ ...peakForm, end_date: value })} />
  </>
);
