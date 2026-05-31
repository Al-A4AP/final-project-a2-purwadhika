import type { FC } from "react";
import { OccupancyCalendar } from "@/components/tenant/OccupancyCalendar";
import { ReportsAnalyticsSection } from "./ReportsAnalyticsSection";
import { ReportsFilterPanel } from "./ReportsFilterPanel";
import type { ReportsPageState } from "./reportsTypes";

export const ReportsContent: FC<{ state: ReportsPageState }> = ({ state }) => (
  <div className="space-y-6 p-4 md:space-y-8 md:p-8"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Laporan & Analitik</h1><ReportsFilterPanel actions={state.actions} filters={state.filters} properties={state.properties} /><ReportsAnalyticsSection state={state} /><OccupancyCalendar data={state.occupancyData} /></div>
);
