import type { FC } from "react";
import type { FieldError, UseFormRegister } from "react-hook-form";
import type { PropertyFormInput } from "./propertyFormSchema";

export const PROPERTY_INPUT_CLASS = "w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none";

interface FieldProps {
  error?: FieldError;
  label: string;
  name: keyof PropertyFormInput;
  placeholder?: string;
  register: UseFormRegister<PropertyFormInput>;
}

export const TextField: FC<FieldProps> = ({ error, label, name, placeholder, register }) => (
  <div><FieldLabel label={label} /><input {...register(name)} placeholder={placeholder} className={PROPERTY_INPUT_CLASS} />{error && <FieldErrorText message={error.message} />}</div>
);

export const TextAreaField: FC<FieldProps & { rows?: number }> = ({ error, label, name, placeholder, register, rows = 4 }) => (
  <div><FieldLabel label={label} /><textarea {...register(name)} rows={rows} placeholder={placeholder} className={PROPERTY_INPUT_CLASS} />{error && <FieldErrorText message={error.message} />}</div>
);

export const FieldLabel: FC<{ label: string }> = ({ label }) => (
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
);

export const FieldErrorText: FC<{ message?: string }> = ({ message }) => (
  <p className="text-red-500 text-xs mt-1">{message}</p>
);
