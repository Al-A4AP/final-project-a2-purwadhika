import type { FC } from "react";

const LegendItem: FC<{ className: string; label: string }> = ({ className, label }) => (
  <div className="flex items-center gap-2"><div className={`h-4 w-4 rounded border ${className}`} /><span>{label}</span></div>
);

export const OccupancyLegend: FC = () => (
  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 md:gap-6">
    <LegendItem className="border-emerald-600 bg-emerald-500" label="Kosong / Tersedia" />
    <LegendItem className="border-orange-600 bg-orange-500" label="Terisi / Dipesan" />
  </div>
);
