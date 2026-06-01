import type { FC } from "react";
import { formatPrice } from "@/lib/formatters";
import type { DashboardAnalytics } from "@/services/tenantReportService";
import type { DashboardRevenuePeriod } from "@/types";
import { getRevenueStatLabel } from "../tenant-dashboard/dashboardRevenuePeriod";
import { KPICard } from "./KPICard";

interface ReportsKpiGridProps {
  analytics: DashboardAnalytics;
  revenuePeriod: DashboardRevenuePeriod;
}

export const ReportsKpiGrid: FC<ReportsKpiGridProps> = ({ analytics, revenuePeriod }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><KPICard label={revenueLabel(revenuePeriod)} value={formatPrice(analytics.totalRevenue)} /><KPICard label="Total Transaksi" value={String(analytics.totalOrders)} /></div>
);

const revenueLabel = (period: DashboardRevenuePeriod) =>
  `${getRevenueStatLabel(period)} (Dikonfirmasi/Selesai)`;
