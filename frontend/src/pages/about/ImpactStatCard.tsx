import type { FC } from "react";
import type { ImpactStat } from "./aboutTypes";

export const ImpactStatCard: FC<{ stat: ImpactStat }> = ({ stat }) => (
  <div className="flex flex-col">
    <span className="text-5xl font-black text-rose-600 mb-4">{stat.value}</span>
    <span className="text-lg font-medium text-slate-900 dark:text-slate-100">{stat.label}</span>
  </div>
);
