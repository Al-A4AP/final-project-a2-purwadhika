import type { FC } from "react";
import { PeakRateDateInput } from "./PeakRateDateInput";
import type { PeakRateFormProps } from "./peakRateTypes";
import { getTodayDateString } from "./dateHelpers";

export const PeakRateDateFields: FC<PeakRateFormProps> = ({ peakForm, onFormChange }) => {
  const todayStr = getTodayDateString();
  const minEndDate = peakForm.start_date && peakForm.start_date >= todayStr ? peakForm.start_date : todayStr;

  return (
    <>
      <div className="col-span-2 text-[11px] text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-100 dark:border-blue-800/30">
        Gunakan rentang tanggal untuk long weekend, tanggal merah, atau periode liburan. Untuk satu tanggal saja, pilih tanggal mulai dan tanggal selesai yang sama.
      </div>
      <PeakRateDateInput label="Tanggal Mulai" value={peakForm.start_date} min={todayStr} onChange={(value) => onFormChange({ ...peakForm, start_date: value })} />
      <PeakRateDateInput label="Tanggal Selesai" value={peakForm.end_date} min={minEndDate} onChange={(value) => onFormChange({ ...peakForm, end_date: value })} />
    </>
  );
};
