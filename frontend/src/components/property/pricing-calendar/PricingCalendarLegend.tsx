import type { FC } from "react";

const LEGEND_ITEMS = [
  { label: "Tersedia", className: "border-gray-300 bg-white" },
  { label: "Di-off tenant", className: "border-amber-300 bg-amber-100" },
  { label: "Terisi customer", className: "border-red-300 bg-red-100" },
  { label: "Peak season", className: "border-white bg-white text-red-600" },
];

export const PricingCalendarLegend: FC = () => (
  <div className="mb-4 flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-300">
    {LEGEND_ITEMS.map((item) => <LegendItem key={item.label} {...item} />)}
  </div>
);

const LegendItem: FC<{ className: string; label: string }> = ({ className, label }) => (
  <span className="inline-flex items-center gap-2">
    <span className={`h-3 w-3 rounded border ${className}`} />
    {label}
  </span>
);
