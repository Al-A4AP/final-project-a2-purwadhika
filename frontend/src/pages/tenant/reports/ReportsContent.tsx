import type { FC } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, BarChart3 } from "lucide-react";
import { ReportsAnalyticsSection } from "./ReportsAnalyticsSection";
import { ReportsFilterPanel } from "./ReportsFilterPanel";
import type { ReportsPageState } from "./reportsTypes";

export const ReportsContent: FC<{ state: ReportsPageState }> = ({ state }) => (
  <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-10 dark:bg-slate-900 pb-24">
    <div className="mx-auto max-w-7xl space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Laporan Pendapatan
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Lacak performa pendapatan, pemesanan, dan tren transaksi di seluruh properti Anda.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Link 
            to="/tenant/property-report"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <BarChart3 size={16} />
            Laporan Properti
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* Filters and Analytics */}
      <div className="space-y-6">
        <ReportsFilterPanel actions={state.actions} filters={state.filters} properties={state.properties} />
        <ReportsAnalyticsSection state={state} />
      </div>

    </div>
  </div>
);
