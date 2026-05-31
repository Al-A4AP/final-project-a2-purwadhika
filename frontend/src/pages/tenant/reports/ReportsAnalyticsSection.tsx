import type { FC } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { ReportsCharts } from "./ReportsCharts";
import { ReportsKpiGrid } from "./ReportsKpiGrid";
import type { ReportsPageState } from "./reportsTypes";

export const ReportsAnalyticsSection: FC<{ state: ReportsPageState }> = ({ state }) => {
  if (state.loading) return <div className="p-20 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700">Memuat Laporan & Analitik...</div>;
  if (state.error) return <ErrorState title="Laporan belum bisa dimuat" message={state.error} onRetry={state.refetchReports} />;
  if (!state.analytics) return <EmptyState title="Tidak ada data laporan" description="Data laporan akan muncul setelah transaksi tersedia." />;
  return <><ReportsKpiGrid analytics={state.analytics} /><ReportsCharts analytics={state.analytics} actions={state.actions} /></>;
};
