import type { FC, ReactNode } from "react";
import { ErrorState } from "@/components/common/ErrorState";
import { SectionLoading } from "@/components/common/SectionLoading";
import { OccupancyCalendar } from "@/components/tenant/OccupancyCalendar";
import type { OccupancyPageState } from "./useOccupancyPageState";

export const OccupancyContent: FC<{ state: OccupancyPageState }> = ({ state }) => (
  <OccupancyShell>
    {renderContent(state)}
  </OccupancyShell>
);

const renderContent = (state: OccupancyPageState) => {
  if (state.loading) return <SectionLoading label="Memuat Kalender Okupasi..." size="lg" variant="report" />;
  if (state.error) return <ErrorState title="Kalender okupasi belum bisa dimuat" message={state.error} onRetry={state.refetch} />;
  return <OccupancyCalendar data={state.data} />;
};

const OccupancyShell: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="space-y-6 p-4 md:space-y-8 md:p-8">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Okupasi Kamar</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Pantau tanggal kamar yang sudah terisi dalam tampilan kalender.</p>
    </div>
    {children}
  </div>
);
