import type { FC, ReactNode } from "react";
import { cn } from "@/lib/formatters";

interface FormFieldProps {
  children: ReactNode;
  error?: string;
  label: string;
  required?: boolean;
}

export const FormField: FC<FormFieldProps> = ({ children, error, label, required }) => (
  <label className="block space-y-2">
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
      {label}{required && <span className="text-red-600"> *</span>}
    </span>
    {children}
    {error && <span className={cn("block text-xs font-medium text-red-600")}>{error}</span>}
  </label>
);
