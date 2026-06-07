import type { HTMLAttributes, FC, ReactNode } from "react";
import { cn } from "@/lib/formatters";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
}

export const Card: FC<CardProps> = ({ children, className, padded = true, ...props }) => (
  <div
    className={cn(
      "rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900",
      padded && "p-5",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
