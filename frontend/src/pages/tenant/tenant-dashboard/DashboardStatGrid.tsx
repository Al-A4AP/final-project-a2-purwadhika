import type { FC } from "react";
import type { DashboardRevenuePeriod, DashboardStats } from "@/types";
import { buildDashboardStatItems } from "@/hooks/tenant/tenant-dashboard/dashboardStats";
import { StatCard } from "./StatCard";

interface DashboardStatGridProps {
  revenuePeriod: DashboardRevenuePeriod;
  stats: DashboardStats | null;
}

export const DashboardStatGrid: FC<DashboardStatGridProps> = ({ revenuePeriod, stats }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
    {buildDashboardStatItems(stats, stats?.revenuePeriod || revenuePeriod).map((item) => <StatCard key={item.label} {...item} />)}
  </div>
);
