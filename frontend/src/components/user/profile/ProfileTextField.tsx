import type { FC, InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface ProfileTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  inputClass: string;
  label: string;
  registration: UseFormRegisterReturn;
}

export const ProfileTextField: FC<ProfileTextFieldProps> = ({ error, inputClass, label, placeholder, registration, type = "text", ...rest }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input {...registration} type={type} placeholder={placeholder} className={inputClass} {...rest} />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);
