import type { FC } from "react";

export const AvailabilityLegend: FC = () => (
  <div className="grid gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300 sm:grid-cols-2">
    <LegendItem className="bg-amber-500" label="Diblok tenant" />
    <LegendItem className="bg-red-600" label="Terisi customer" />
  </div>
);

const LegendItem: FC<{ className: string; label: string }> = ({ className, label }) => (
  <span className="inline-flex items-center gap-2">
    <span className={`h-3 w-3 rounded-full ${className}`} />
    {label}
  </span>
);
