import type { FC } from "react";
import { SectionLoading } from "@/components/common/SectionLoading";
import { ErrorState } from "@/components/common/ErrorState";
import { PropertyReportSummary } from "./PropertyReportSummary";
import { PropertyPerformanceList } from "./PropertyPerformanceList";
import type { PropertyReportState } from "@/hooks/tenant/property-report/usePropertyReportState";

export const PropertyReportContent: FC<{ state: PropertyReportState }> = ({ state }) => (
  <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-10 dark:bg-slate-900 pb-24">
    <div className="mx-auto max-w-7xl space-y-8">
      <PropertyReportHeader />
      <ReportBody state={state} />
    </div>
  </div>
);

const PropertyReportHeader: FC = () => (
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
      Laporan Properti
    </h1>
    <p className="mt-2 text-slate-600 dark:text-slate-400">
      Pantau performa properti, ketersediaan kamar, dan kesehatan operasional.
    </p>
  </div>
);

const ReportBody: FC<{ state: PropertyReportState }> = ({ state }) => {
  if (state.loading) return <SectionLoading label="Memuat laporan properti..." size="lg" variant="report" />;
  if (state.error) return <ErrorState title="Laporan belum bisa dimuat" message={state.error} onRetry={state.refetch} />;
  return (
    <div className="space-y-6">
      <PropertyReportSummary data={state.data} />
      <PropertyPerformanceList data={state.data} />
    </div>
  );
};
