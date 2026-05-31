import type { FC } from "react";
import { formatPrice } from "@/lib/formatters";
import type { DashboardAnalytics } from "@/services/tenantReportService";
import { KPICard } from "./KPICard";

export const ReportsKpiGrid: FC<{ analytics: DashboardAnalytics }> = ({ analytics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><KPICard label="Total Pendapatan (Dikonfirmasi/Selesai)" value={formatPrice(analytics.totalRevenue)} /><KPICard label="Total Transaksi" value={String(analytics.totalOrders)} /></div>
);
