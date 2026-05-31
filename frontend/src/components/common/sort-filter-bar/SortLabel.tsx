import type { FC } from "react";
import { ArrowUpDown } from "lucide-react";

export const SortLabel: FC = () => (
  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider shrink-0">
    <ArrowUpDown size={13} /> Urutkan:
  </span>
);
