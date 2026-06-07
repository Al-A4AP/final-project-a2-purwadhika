import type { FC } from "react";
import type { DashboardRevenuePeriod } from "@/types";
import { REVENUE_PERIOD_OPTIONS } from "@/hooks/tenant/tenant-dashboard/dashboardRevenuePeriod";
import { BarChart3 } from "lucide-react";
import { RevenueTrendChart } from "./RevenueTrendChart";

interface TenantRevenuePanelProps {
  revenuePeriod: DashboardRevenuePeriod;
  setRevenuePeriod: (period: DashboardRevenuePeriod) => void;
  revenue: number;
  revenueTrend?: { label: string; amount: number }[];
}

export const TenantRevenuePanel: FC<TenantRevenuePanelProps> = ({ revenuePeriod, setRevenuePeriod, revenueTrend }) => {
  return (
    <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
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

      <RevenueTrendChart data={revenueTrend || []} />
      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Data pendapatan ditampilkan sampai hari ini. Jika periode belum lengkap, grafik memakai transaksi yang sudah tersedia.
      </p>
    </div>
  );
};
