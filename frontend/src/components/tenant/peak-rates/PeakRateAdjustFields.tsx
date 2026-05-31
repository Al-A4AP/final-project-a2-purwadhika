import type { FC } from "react";
import { PeakRateTypeSelect } from "./PeakRateTypeSelect";
import { PeakRateValueInput } from "./PeakRateValueInput";
import type { PeakRateFormProps } from "./peakRateTypes";

export const PeakRateAdjustFields: FC<PeakRateFormProps> = ({ peakForm, onFormChange }) => (
  <>
    <PeakRateTypeSelect peakForm={peakForm} onFormChange={onFormChange} />
    <PeakRateValueInput peakForm={peakForm} onFormChange={onFormChange} />
  </>
);
