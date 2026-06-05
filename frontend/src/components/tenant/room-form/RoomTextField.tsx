import type { FC } from "react";
import type { RoomFormInput } from "@/types";
import type { RoomFormFieldName } from "./types";
import { RoomFieldShell } from "./RoomFieldShell";
import { formatCurrencyInputValue, readCurrencyInputValue } from "@/lib/currencyInput";

interface RoomTextFieldProps {
  className?: string;
  form: RoomFormInput;
  inputClass: string;
  label: string;
  name: RoomFormFieldName;
  onChange: (form: RoomFormInput) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  min?: string;
  step?: string;
  isPrice?: boolean;
}

export const RoomTextField: FC<RoomTextFieldProps> = (props) => {
  const value = String(props.form[props.name] ?? "");
  const inputValue = props.isPrice ? formatCurrencyInputValue(value) : value;
  const inputType = props.isPrice ? "text" : props.type || "text";
  const updateValue = (value: string) =>
    props.onChange({ ...props.form, [props.name]: props.isPrice ? readCurrencyInputValue(value) : value });

  return (
    <RoomFieldShell label={props.label} className={props.className}>
      {props.isPrice ? <PriceInput {...props} inputType={inputType} value={inputValue} updateValue={updateValue} /> : <input type={inputType} min={props.min} step={props.step} value={inputValue} onChange={(event) => updateValue(event.target.value)} placeholder={props.placeholder} className={props.inputClass} required={props.required} />}
    </RoomFieldShell>
  );
};

const PriceInput: FC<RoomTextFieldProps & { inputType: string; value: string; updateValue: (value: string) => void }> = (props) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">Rp</span>
    <input type={props.inputType} inputMode="numeric" min={props.min} step={props.step} value={props.value} onChange={(event) => props.updateValue(event.target.value)} placeholder={props.placeholder} className={`${props.inputClass} pl-10`} required={props.required} />
  </div>
);
