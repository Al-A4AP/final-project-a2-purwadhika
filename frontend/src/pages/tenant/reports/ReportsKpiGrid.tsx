import type { FC } from "react";
import { formatPrice } from "@/lib/formatters";
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
  const avgBooking = analytics.totalOrders > 0 ? analytics.totalRevenue / analytics.totalOrders : 0;
  
  // Try to find the best performing property from recent orders if possible, or omit safely.
  // Since we don't have a direct "best property" stat from the backend without calculating from paginated data,
  // we will omit it to obey the rules, and show average booking value instead.

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KPICard 
        label={revenueLabel(revenuePeriod)} 
        value={formatPrice(analytics.totalRevenue)} 
        icon={<Wallet size={20} />} 
        colorClass="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20"
      />
      <KPICard 
        label="Total Transaksi" 
        value={String(analytics.totalOrders)} 
        icon={<FileText size={20} />} 
        colorClass="text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20"
      />
      <KPICard 
        label="Rata-rata Transaksi" 
        value={formatPrice(avgBooking)} 
        icon={<TrendingUp size={20} />} 
        colorClass="text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20"
      />
    </div>
  );
};

const revenueLabel = (period: DashboardRevenuePeriod) =>
  `${getRevenueStatLabel(period)} (Berhasil)`;
