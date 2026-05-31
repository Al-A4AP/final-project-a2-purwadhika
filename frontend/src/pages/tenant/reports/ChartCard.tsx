import type { FC, ReactNode } from "react";

export const ChartCard: FC<{ children: ReactNode; title: string }> = ({ children, title }) => (
  <div className="rounded-xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-6"><h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white md:mb-6">{title}</h2>{children}</div>
);
