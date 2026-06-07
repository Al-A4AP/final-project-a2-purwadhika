import type { ButtonHTMLAttributes, FC, ReactNode } from "react";
import { cn } from "@/lib/formatters";

type ButtonVariant = "danger" | "ghost" | "outline" | "primary" | "secondary";
type ButtonSize = "icon" | "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

const baseClass =
  "inline-flex items-center justify-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

const variantClass: Record<ButtonVariant, string> = {
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
  outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
  primary: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200",
};

const sizeClass: Record<ButtonSize, string> = {
  icon: "h-10 w-10 rounded-xl p-0",
  md: "rounded-xl px-5 py-3 text-sm",
  sm: "rounded-lg px-3 py-2 text-xs",
};

export const Button: FC<ButtonProps> = ({
  children,
  className,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}) => (
  <button
    className={cn(baseClass, variantClass[variant], sizeClass[size], className)}
    type={type}
    {...props}
  >
    {children}
  </button>
);
