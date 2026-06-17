import { useState } from "react";
import type { FC } from "react";
import { SectionLoading } from "@/components/common/SectionLoading";
import { ErrorState } from "@/components/common/ErrorState";
import type { PropertyReportState } from "@/hooks/tenant/property-report/usePropertyReportState";
import {
  CalendarPanel,
  PropertyReportHeader,
  ReportPanel,
  ReportTabs,
} from "./PropertyReportContentParts";

export const PropertyReportContent: FC<{ state: PropertyReportState }> = ({
  state,
}) => (
  <div className="min-h-screen bg-slate-50 px-4 py-8 pb-24 dark:bg-slate-900 md:p-10">
    <div className="mx-auto max-w-7xl space-y-8">
      <PropertyReportHeader />
      <ReportBody state={state} />
    </div>
  </div>
);

const ReportBody: FC<{ state: PropertyReportState }> = ({ state }) => {
  const [activeTab, setActiveTab] = useState<"report" | "calendar">("report");
  if (state.loading) return <SectionLoading label="Memuat data..." size="lg" variant="report" />;
  if (state.error) return <ErrorState title="Data belum bisa dimuat" message={state.error} onRetry={state.refetch} />;

  return (
    <div className="space-y-6">
      <ReportTabs activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === "report" ? <ReportPanel data={state.data} /> : <CalendarPanel data={state.data} />}
    </div>
  );
};
