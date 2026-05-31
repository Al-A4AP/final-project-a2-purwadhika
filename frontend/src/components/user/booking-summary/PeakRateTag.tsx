import type { FC } from "react";

export const PeakRateTag: FC<{ label?: string }> = ({ label }) => (
  <span className="rounded bg-red-100 px-1 text-[9px] font-semibold text-red-600 dark:bg-red-900/40 dark:text-red-400">{label || "Peak"}</span>
);
