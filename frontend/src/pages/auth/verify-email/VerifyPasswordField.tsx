import type { FC } from "react";
import type { UseFormRegister } from "react-hook-form";
import { VisibilityButton } from "./VisibilityButton";
import { FieldError } from "./FieldError";
import { INPUT_CLASS } from "./verifyEmailStyles";
import type { VerifyEmailInput } from "@/validations/auth";

type VerifyPasswordFieldProps = {
  label: string; name: keyof VerifyEmailInput; placeholder: string; visible: boolean;
  onToggle: () => void; error?: string; register: UseFormRegister<VerifyEmailInput>;
};

export const VerifyPasswordField: FC<VerifyPasswordFieldProps> = (props) => (
  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{props.label}</label><div className="relative"><input {...props.register(props.name)} type={props.visible ? "text" : "password"} placeholder={props.placeholder} className={INPUT_CLASS} /><VisibilityButton visible={props.visible} onToggle={props.onToggle} /></div><FieldError message={props.error} /></div>
);
