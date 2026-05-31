import type { FC } from "react";
import type { RoomFormInput } from "@/types";
import type { RoomFormFieldName } from "./types";
import { RoomFieldShell } from "./RoomFieldShell";

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
}

export const RoomTextField: FC<RoomTextFieldProps> = (props) => (
  <RoomFieldShell label={props.label} className={props.className}>
    <input type={props.type || "text"} min={props.min} value={String(props.form[props.name] ?? "")} onChange={(event) => props.onChange({ ...props.form, [props.name]: event.target.value })} placeholder={props.placeholder} className={props.inputClass} required={props.required} />
  </RoomFieldShell>
);
