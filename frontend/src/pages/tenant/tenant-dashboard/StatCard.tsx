import type { FC } from "react";

interface StatCardProps {
  color: string;
  icon: FC<{ className?: string; size?: number }>;
  label: string;
  value: number | string;
}

export const StatCard: FC<StatCardProps> = ({ color, icon: Icon, label, value }) => (
  <div className="w-full overflow-hidden rounded-xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div className="mb-4 flex items-center justify-between">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <div className={`rounded-lg p-2 ${color}`}><Icon size={20} /></div>
    </div>
    <p className="truncate text-xl font-bold text-gray-900 dark:text-white md:text-2xl" title={String(value)}>{value}</p>
  </div>
);
