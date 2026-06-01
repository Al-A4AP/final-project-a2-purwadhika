import type { FC } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { SectionLoading } from "@/components/common/SectionLoading";
import { ReportsCharts } from "./ReportsCharts";
import { ReportsKpiGrid } from "./ReportsKpiGrid";
import type { ReportsPageState } from "./reportsTypes";

export const ReportsAnalyticsSection: FC<{ state: ReportsPageState }> = ({ state }) => {
  if (state.loading) return <SectionLoading label="Memuat Laporan & Analitik..." size="lg" variant="report" />;
  if (state.error) return <ErrorState title="Laporan belum bisa dimuat" message={state.error} onRetry={state.refetchReports} />;
  if (!state.analytics) return <EmptyState title="Tidak ada data laporan" description="Data laporan akan muncul setelah transaksi tersedia." />;
  return <><ReportsKpiGrid analytics={state.analytics} revenuePeriod={state.filters.revenuePeriod} /><ReportsCharts analytics={state.analytics} actions={state.actions} /></>;
};
