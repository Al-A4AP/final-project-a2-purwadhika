import type { FC, ReactNode } from "react";

export const ChartCard: FC<{ children: ReactNode; title: string }> = ({ children, title }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700"><h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">{title}</h2>{children}</div>
);
