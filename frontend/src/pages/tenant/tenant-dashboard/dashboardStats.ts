import { BedDouble, Building2, Clock, TrendingUp } from "lucide-react";
import type { DashboardRevenuePeriod, DashboardStats } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import { getRevenueStatLabel } from "./dashboardRevenuePeriod";

export const buildDashboardStatItems = (stats: DashboardStats | null, period: DashboardRevenuePeriod) => [
  { icon: Building2, label: "Total Properti", value: stats?.propertyCount || 0, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
  { icon: BedDouble, label: "Total Kamar", value: stats?.roomCount || 0, color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20" },
  { icon: Clock, label: "Perlu Konfirmasi", value: stats?.pendingOrders || 0, color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20" },
  { icon: TrendingUp, label: getRevenueStatLabel(period), value: formatCurrency(stats?.revenue ?? stats?.monthlyRevenue ?? 0), color: "text-green-600 bg-green-50 dark:bg-green-900/20" },
];
