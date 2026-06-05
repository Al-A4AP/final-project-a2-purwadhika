import type { FC, ReactNode } from "react";

export const ChartCard: FC<{ children: ReactNode; title: string }> = ({ children, title }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <h2 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
    {children}
  </div>
);
