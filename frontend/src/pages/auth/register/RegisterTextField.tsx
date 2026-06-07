import type { FC } from "react";
import type { RegisterInput } from "@/validations/auth";
import { REGISTER_INPUT_CLASS } from "./registerStyles";
import type { RegisterPageState } from "@/hooks/auth/register/registerTypes";

type RegisterTextFieldProps = { label: string; name: keyof Pick<RegisterInput, "name" | "email">; placeholder: string; state: RegisterPageState; type?: string };

export const RegisterTextField: FC<RegisterTextFieldProps> = ({ label, name, placeholder, state, type = "text" }) => {
  const error = state.form.formState.errors[name];
  return <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label><input {...state.form.register(name)} type={type} placeholder={placeholder} className={REGISTER_INPUT_CLASS} />{error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}</div>;
};
