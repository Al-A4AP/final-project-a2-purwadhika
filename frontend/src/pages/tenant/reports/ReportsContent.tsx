import type { FC } from "react";
import { ReportsAnalyticsSection } from "./ReportsAnalyticsSection";
import { ReportsFilterPanel } from "./ReportsFilterPanel";
import type { ReportsPageState } from "@/hooks/tenant/reports/reportsTypes";

export const ReportsContent: FC<{ state: ReportsPageState }> = ({ state }) => (
  <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-10 dark:bg-slate-900 pb-24">
    <div className="mx-auto max-w-7xl space-y-8">
      <ReportsHeader />
      <div className="space-y-6">
        <ReportsFilterPanel actions={state.actions} filters={state.filters} properties={state.properties} />
        <ReportsAnalyticsSection state={state} />
      </div>
    </div>
  </div>
);

const ReportsHeader = () => (
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Laporan Penjualan</h1>
    <p className="mt-2 text-slate-600 dark:text-slate-400">Lacak performa penjualan, pemesanan, dan tren transaksi di seluruh properti Anda.</p>
  </div>
);
