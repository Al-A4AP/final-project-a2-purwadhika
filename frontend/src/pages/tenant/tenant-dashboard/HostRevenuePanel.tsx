import type { FC } from "react";
import type { DashboardRevenuePeriod } from "@/types";
import { REVENUE_PERIOD_OPTIONS } from "@/hooks/tenant/tenant-dashboard/dashboardRevenuePeriod";
import { BarChart3 } from "lucide-react";

interface HostRevenuePanelProps {
  revenuePeriod: DashboardRevenuePeriod;
  setRevenuePeriod: (period: DashboardRevenuePeriod) => void;
  revenue: number;
}

export const HostRevenuePanel: FC<HostRevenuePanelProps> = ({ revenuePeriod, setRevenuePeriod }) => {
  return (
    <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <BarChart3 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Trend Pendapatan</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Analisis performa pendapatan properti Anda</p>
          </div>
        </div>
        
        <select 
          value={revenuePeriod} 
          onChange={(event) => setRevenuePeriod(event.target.value as DashboardRevenuePeriod)} 
          className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition hover:bg-slate-100 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus:border-slate-500"
          aria-label="Pilih periode pendapatan"
        >
          {REVENUE_PERIOD_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="text-center">
          <BarChart3 size={32} className="mx-auto mb-3 text-slate-400 dark:text-slate-500" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Grafik pendapatan belum tersedia.</p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Lihat Laporan Penjualan untuk detail lengkap.</p>
        </div>
      </div>
    </div>
  );
};
