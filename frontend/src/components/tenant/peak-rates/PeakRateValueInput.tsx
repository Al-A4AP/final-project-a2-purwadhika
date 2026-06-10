import type { FC } from "react";
import { PEAK_RATE_INPUT_CLASS } from "./peakRateStyles";
import type { PeakRateFormProps } from "./peakRateTypes";
import { formatCurrencyInputValue, readCurrencyInputValue } from "@/lib/currencyInput";

const getValuePlaceholder = (rateType: string) => (rateType === "PERCENTAGE" ? "10" : "100000");
const getStep = (rateType: string) => (rateType === "PERCENTAGE" ? "1" : "10000");

export const PeakRateValueInput: FC<Pick<PeakRateFormProps, "peakForm" | "onFormChange">> = ({ peakForm, onFormChange }) => {
  const isNominal = peakForm.rate_type === "NOMINAL";
  const value = isNominal ? formatCurrencyInputValue(peakForm.rate_value) : peakForm.rate_value;
  const updateValue = (nextValue: string) => {
    // Basic clamping logic for UX, server will also validate if needed
    let sanitized = nextValue;
    if (!isNominal && nextValue && Number(nextValue) > 300) {
      sanitized = "300";
    }
    onFormChange({ ...peakForm, rate_value: isNominal ? readCurrencyInputValue(sanitized) : sanitized });
  };

  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">Nilai Tambahan</label>
      {isNominal ? <NominalInput value={value} onChange={updateValue} /> : <input type="number" min="1" max="300" step={getStep(peakForm.rate_type)} required placeholder={getValuePlaceholder(peakForm.rate_type)} value={value} onChange={(event) => updateValue(event.target.value)} className={PEAK_RATE_INPUT_CLASS} />}
      <p className="mt-1 text-[10px] text-slate-500">
        {isNominal ? "Minimal Rp1.000" : "Maksimal 300%"}
      </p>
    </div>
  );
};

const NominalInput: FC<{ onChange: (value: string) => void; value: string }> = ({ onChange, value }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">Rp</span>
    <input type="text" inputMode="numeric" minLength={4} required placeholder={getValuePlaceholder("NOMINAL")} value={value} onChange={(event) => onChange(event.target.value)} className={`${PEAK_RATE_INPUT_CLASS} pl-10`} />
  </div>
);
