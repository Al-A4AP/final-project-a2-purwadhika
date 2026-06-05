import type { FC } from "react";
import { Building2 } from "lucide-react";

interface PropertiesSummaryProps {
  total: number;
}

export const PropertiesSummary: FC<PropertiesSummaryProps> = ({ total }) => (
  <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <Building2 size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Properti</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{total}</p>
        </div>
      </div>
    </div>
  </div>
);
