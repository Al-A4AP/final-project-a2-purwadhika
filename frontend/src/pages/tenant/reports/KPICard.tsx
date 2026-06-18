import type { FC, ReactNode } from "react";

interface KPICardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  colorClass?: string;
}

export const KPICard: FC<KPICardProps> = ({ label, value, icon, colorClass = "text-slate-600 bg-slate-100 dark:bg-slate-800" }) => (
  <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
    <KPIHeader colorClass={colorClass} icon={icon} label={label} />
    <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
  </div>
);

const KPIHeader: FC<Pick<KPICardProps, "colorClass" | "icon" | "label">> = ({ colorClass, icon, label }) => (
  <div className="flex items-start justify-between gap-4">
    <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
    {icon ? <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorClass}`}>{icon}</div> : null}
  </div>
);
