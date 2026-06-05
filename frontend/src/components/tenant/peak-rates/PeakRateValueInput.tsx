import type { FC } from "react";
import { PEAK_RATE_INPUT_CLASS } from "./peakRateStyles";
import type { PeakRateFormProps } from "./peakRateTypes";
import { formatCurrencyInputValue, readCurrencyInputValue } from "@/lib/currencyInput";

const getValuePlaceholder = (rateType: string) => (rateType === "PERCENTAGE" ? "10" : "100000");
const getStep = (rateType: string) => (rateType === "PERCENTAGE" ? "1" : "10000");

export const PeakRateValueInput: FC<Pick<PeakRateFormProps, "peakForm" | "onFormChange">> = ({ peakForm, onFormChange }) => {
  const isNominal = peakForm.rate_type === "NOMINAL";
  const value = isNominal ? formatCurrencyInputValue(peakForm.rate_value) : peakForm.rate_value;
  const updateValue = (nextValue: string) =>
    onFormChange({ ...peakForm, rate_value: isNominal ? readCurrencyInputValue(nextValue) : nextValue });

  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">Nilai Tambahan</label>
      {isNominal ? <NominalInput value={value} onChange={updateValue} /> : <input type="number" min="0" step={getStep(peakForm.rate_type)} required placeholder={getValuePlaceholder(peakForm.rate_type)} value={value} onChange={(event) => updateValue(event.target.value)} className={PEAK_RATE_INPUT_CLASS} />}
    </div>
  );
};

const NominalInput: FC<{ onChange: (value: string) => void; value: string }> = ({ onChange, value }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">Rp</span>
    <input type="text" inputMode="numeric" min="0" required placeholder={getValuePlaceholder("NOMINAL")} value={value} onChange={(event) => onChange(event.target.value)} className={`${PEAK_RATE_INPUT_CLASS} pl-10`} />
  </div>
);
