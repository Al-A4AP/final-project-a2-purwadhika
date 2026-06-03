import type { FC } from "react";
import { PEAK_RATE_INPUT_CLASS } from "./peakRateStyles";
import type { PeakRateFormProps } from "./peakRateTypes";
import { formatPrice } from "@/lib/formatters";

const getValuePlaceholder = (rateType: string) => (rateType === "PERCENTAGE" ? "10" : "100000");
const getStep = (rateType: string) => (rateType === "PERCENTAGE" ? "1" : "10000");

export const PeakRateValueInput: FC<Pick<PeakRateFormProps, "peakForm" | "onFormChange">> = ({ peakForm, onFormChange }) => {
  const numericVal = Number(peakForm.rate_value);
  const showPricePreview = peakForm.rate_type === "NOMINAL" && !isNaN(numericVal) && numericVal > 0;

  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">Nilai Tambahan</label>
      <input type="number" min="0" step={getStep(peakForm.rate_type)} required placeholder={getValuePlaceholder(peakForm.rate_type)} value={peakForm.rate_value} onChange={(event) => onFormChange({ ...peakForm, rate_value: event.target.value })} className={PEAK_RATE_INPUT_CLASS} />
      {showPricePreview && (
        <p className="mt-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
          Format: {formatPrice(numericVal)}
        </p>
      )}
    </div>
  );
};
