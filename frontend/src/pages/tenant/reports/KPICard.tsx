import type { FC } from "react";

export const KPICard: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700"><p className="text-sm text-gray-500 mb-1">{label}</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p></div>
);
