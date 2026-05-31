import type { FC } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface ProfileTextFieldProps {
  error?: string;
  inputClass: string;
  label: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  type?: string;
}

export const ProfileTextField: FC<ProfileTextFieldProps> = ({ error, inputClass, label, placeholder, registration, type = "text" }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input {...registration} type={type} placeholder={placeholder} className={inputClass} />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);
