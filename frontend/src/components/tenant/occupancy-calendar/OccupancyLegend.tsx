import type { FC } from "react";

const LegendItem: FC<{ className: string; label: string }> = ({ className, label }) => (
  <div className="flex items-center gap-2">
    <div className={`h-3 w-3 rounded-sm ${className}`} />
    <span className="font-medium text-slate-600 dark:text-slate-400">{label}</span>
  </div>
);

export const OccupancyLegend: FC = () => (
  <div className="flex flex-wrap items-center gap-4 text-xs md:gap-6">
    <LegendItem className="bg-emerald-100 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800" label="Tersedia" />
    <LegendItem className="bg-orange-500 border border-orange-600 shadow-sm" label="Terjadwal / Dipesan" />
    <LegendItem className="bg-slate-200 border border-slate-300 dark:bg-slate-800 dark:border-slate-700" label="Tidak Tersedia" />
    <LegendItem className="bg-blue-100 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800" label="Peak Season" />
  </div>
);
