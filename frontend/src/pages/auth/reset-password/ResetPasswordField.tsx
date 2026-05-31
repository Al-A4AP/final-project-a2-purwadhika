import type { FC } from "react";
import type { UseFormRegister } from "react-hook-form";
import type { ResetPasswordInput } from "@/validations/auth";

interface ResetPasswordFieldProps {
  error?: string;
  label: string;
  name: keyof ResetPasswordInput;
  placeholder: string;
  register: UseFormRegister<ResetPasswordInput>;
}

export const ResetPasswordField: FC<ResetPasswordFieldProps> = ({ error, label, name, placeholder, register }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input {...register(name)} type="password" placeholder={placeholder} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-red-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);
