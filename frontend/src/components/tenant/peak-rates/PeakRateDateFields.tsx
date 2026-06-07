import type { FC } from "react";
import { PeakRateDateInput } from "./PeakRateDateInput";
import type { PeakRateFormProps } from "./peakRateTypes";

export const PeakRateDateFields: FC<PeakRateFormProps> = ({ peakForm, onFormChange }) => {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const todayStr = today.toISOString().slice(0, 10);
  const minEndDate = peakForm.start_date && peakForm.start_date >= todayStr ? peakForm.start_date : todayStr;

  return (
    <>
      <PeakRateDateInput label="Tanggal Mulai" value={peakForm.start_date} min={todayStr} onChange={(value) => onFormChange({ ...peakForm, start_date: value })} />
      <PeakRateDateInput label="Tanggal Selesai" value={peakForm.end_date} min={minEndDate} onChange={(value) => onFormChange({ ...peakForm, end_date: value })} />
    </>
  );
};
