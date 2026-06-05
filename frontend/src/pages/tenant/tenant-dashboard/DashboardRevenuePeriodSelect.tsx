import type { FC } from "react";
import type { DashboardRevenuePeriod } from "@/types";
import { REVENUE_PERIOD_OPTIONS } from "@/hooks/tenant/tenant-dashboard/dashboardRevenuePeriod";

interface DashboardRevenuePeriodSelectProps {
  onChange: (period: DashboardRevenuePeriod) => void;
  value: DashboardRevenuePeriod;
}

const selectClass = "h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";

export const DashboardRevenuePeriodSelect: FC<DashboardRevenuePeriodSelectProps> = ({ onChange, value }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">Periode pendapatan</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">Default bulanan, bisa diganti sesuai ringkasan yang dibutuhkan.</p>
    </div>
    <select value={value} onChange={(event) => onChange(event.target.value as DashboardRevenuePeriod)} className={selectClass} aria-label="Pilih periode pendapatan">
      {REVENUE_PERIOD_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </div>
);
