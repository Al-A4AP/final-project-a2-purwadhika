import type { FC } from "react";
import type { RoomFormInput } from "@/types";
import type { RoomFormFieldName } from "./types";
import { RoomFieldShell } from "./RoomFieldShell";
import { formatPrice } from "@/lib/formatters";

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
  const valueAsNumber = Number(props.form[props.name]);
  const hasValidPrice = props.isPrice && !isNaN(valueAsNumber) && valueAsNumber > 0;

  return (
    <RoomFieldShell label={props.label} className={props.className}>
      <input type={props.type || "text"} min={props.min} step={props.step} value={String(props.form[props.name] ?? "")} onChange={(event) => props.onChange({ ...props.form, [props.name]: event.target.value })} placeholder={props.placeholder} className={props.inputClass} required={props.required} />
      {hasValidPrice && (
        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          Format: {formatPrice(valueAsNumber)}
        </p>
      )}
    </RoomFieldShell>
  );
};
