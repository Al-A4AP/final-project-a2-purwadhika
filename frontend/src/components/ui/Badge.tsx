import type { FC, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/formatters";
import type { BadgeTone } from "@/types/ui";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: BadgeTone;
}

const toneClass: Record<BadgeTone, string> = {
  green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200",
  neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  red: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-200",
  yellow: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200",
};

export const Badge: FC<BadgeProps> = ({ children, className, tone = "neutral", ...props }) => (
  <span
    className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", toneClass[tone], className)}
    {...props}
  >
    {children}
  </span>
);
