import type { FC } from "react";
import { PeakRateAdjustFields } from "./PeakRateAdjustFields";
import { PeakRateDateFields } from "./PeakRateDateFields";
import { PeakRateDescriptionInput } from "./PeakRateDescriptionInput";
import { PeakRateSubmitButton } from "./PeakRateSubmitButton";
import type { PeakRateFormProps } from "./peakRateTypes";

export const PeakRateForm: FC<PeakRateFormProps> = (props) => (
  <form onSubmit={props.onAddRate} className="border-t dark:border-slate-700 pt-4 space-y-4">
    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-305">Tambah Aturan Peak Season Baru</h3>
    <div className="grid grid-cols-2 gap-3">
      <PeakRateDateFields {...props} />
      <PeakRateAdjustFields {...props} />
      <PeakRateDescriptionInput {...props} />
    </div>
    <PeakRateSubmitButton />
  </form>
);
