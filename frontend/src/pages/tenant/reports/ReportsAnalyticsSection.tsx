import type { FC } from "react";
import { ReportsCharts } from "./ReportsCharts";
import { ReportsKpiGrid } from "./ReportsKpiGrid";
import type { ReportsPageState } from "./reportsTypes";

export const ReportsAnalyticsSection: FC<{ state: ReportsPageState }> = ({ state }) => {
  if (state.loading) return <div className="p-20 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700">Memuat Laporan & Analitik...</div>;
  if (!state.analytics) return <div className="p-10 text-center text-gray-500 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700">Tidak ada data laporan.</div>;
  return <><ReportsKpiGrid analytics={state.analytics} /><ReportsCharts analytics={state.analytics} actions={state.actions} /></>;
};
