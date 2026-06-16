import type { FC } from "react";
import type { FieldError, UseFormRegister } from "react-hook-form";
import type { PropertyFormInput } from "@/hooks/tenant/property-form/propertyFormSchema";

export const PROPERTY_INPUT_CLASS =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

interface FieldProps {
  error?: FieldError;
  label: string;
  name: keyof PropertyFormInput;
  placeholder?: string;
  register: UseFormRegister<PropertyFormInput>;
  helperText?: string;
  maxLength?: number;
}

export const TextField: FC<FieldProps> = ({
  error,
  label,
  name,
  placeholder,
  register,
  helperText,
  maxLength,
}) => (
  <div>
    <FieldLabel label={label} />
    <input
      {...register(name)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`${PROPERTY_INPUT_CLASS} ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
    />
    {helperText && !error && (
      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
        {helperText}
      </p>
    )}
    {error && <FieldErrorText message={error.message} />}
  </div>
);

export const TextAreaField: FC<FieldProps & { rows?: number }> = ({
  error,
  label,
  name,
  placeholder,
  register,
  rows = 4,
  maxLength,
  helperText,
}) => (
  <div>
    <FieldLabel label={label} />
    <textarea
      {...register(name)}
      rows={rows}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`${PROPERTY_INPUT_CLASS} resize-y ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
    />
    {helperText && !error && (
      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
        {helperText}
      </p>
    )}
    {error && <FieldErrorText message={error.message} />}
  </div>
);

export const FieldLabel: FC<{ label: string }> = ({ label }) => (
  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
    {label} <span className="text-red-500">*</span>
  </label>
);

export const FieldErrorText: FC<{ message?: string }> = ({ message }) => (
  <p className="mt-1.5 text-xs font-medium text-red-500">{message}</p>
);
