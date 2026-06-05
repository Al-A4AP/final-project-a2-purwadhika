import type { FC, ReactNode } from "react";
import { formatCurrency } from "@/lib/formatters";
import type { DashboardAnalytics } from "@/services/tenantReportService";
import type { DashboardRevenuePeriod } from "@/types";
import { getRevenueStatLabel } from "../tenant-dashboard/dashboardRevenuePeriod";
import { KPICard } from "./KPICard";
import { Wallet, FileText, TrendingUp } from "lucide-react";

interface ReportsKpiGridProps {
  analytics: DashboardAnalytics;
  revenuePeriod: DashboardRevenuePeriod;
}

export const ReportsKpiGrid: FC<ReportsKpiGridProps> = ({ analytics, revenuePeriod }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {buildKpiItems(analytics, revenuePeriod).map((item) => <KPICard key={item.label} {...item} />)}
    </div>
  );
};

const buildKpiItems = (analytics: DashboardAnalytics, period: DashboardRevenuePeriod): KpiItem[] => [
  revenueKpi(analytics.totalRevenue, period),
  totalOrdersKpi(analytics.totalOrders),
  averageBookingKpi(averageBooking(analytics)),
];

const averageBooking = (analytics: DashboardAnalytics) =>
  analytics.totalOrders > 0 ? analytics.totalRevenue / analytics.totalOrders : 0;

const revenueKpi = (totalRevenue: number, period: DashboardRevenuePeriod): KpiItem => ({
  colorClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20",
  icon: <Wallet size={20} />,
  label: revenueLabel(period),
  value: formatCurrency(totalRevenue),
});

const totalOrdersKpi = (totalOrders: number): KpiItem => ({
  colorClass: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20",
  icon: <FileText size={20} />,
  label: "Total Transaksi",
  value: String(totalOrders),
});

const averageBookingKpi = (value: number): KpiItem => ({
  colorClass: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20",
  icon: <TrendingUp size={20} />,
  label: "Rata-rata Transaksi",
  value: formatCurrency(value),
});

const revenueLabel = (period: DashboardRevenuePeriod) =>
  `${getRevenueStatLabel(period)} (Berhasil)`;

interface KpiItem {
  colorClass: string;
  icon: ReactNode;
  label: string;
  value: string;
}
