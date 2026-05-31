import type { FC } from "react";
import type { DashboardStats } from "@/types";
import { buildDashboardStatItems } from "./dashboardStats";
import { StatCard } from "./StatCard";

export const DashboardStatGrid: FC<{ stats: DashboardStats | null }> = ({ stats }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
    {buildDashboardStatItems(stats).map((item) => <StatCard key={item.label} {...item} />)}
  </div>
);
