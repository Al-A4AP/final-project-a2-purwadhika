import type { FC } from "react";
import { SectionLoading } from "@/components/common/SectionLoading";
import { useTenantDashboard } from "@/hooks/tenant/tenant-dashboard/useTenantDashboard";
import { TenantDashboardHeader } from "./tenant-dashboard/TenantDashboardHeader";
import { TenantKpiGrid } from "./tenant-dashboard/TenantKpiGrid";
import { TenantRevenuePanel } from "./tenant-dashboard/TenantRevenuePanel";
import { TenantRecentReservations } from "./tenant-dashboard/TenantRecentReservations";
import { TenantOperationsGrid } from "./tenant-dashboard/TenantOperationsGrid";

const DashboardPage: FC = () => {
  const { loading, revenuePeriod, setRevenuePeriod, stats } = useTenantDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 pt-8 md:pt-12">
        <SectionLoading className="mx-auto max-w-7xl px-4" variant="report" label="Memuat dashboard operasional..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-10 dark:bg-slate-900 pb-24">
      <div className="mx-auto max-w-7xl">
        <TenantDashboardHeader />
        <TenantKpiGrid stats={stats} />
        <TenantRevenuePanel revenuePeriod={revenuePeriod} setRevenuePeriod={setRevenuePeriod} revenue={stats?.revenue || 0} revenueTrend={stats?.revenueTrend} />
        <TenantRecentReservations orders={stats?.recentOrders} />
        <TenantOperationsGrid />
      </div>
    </div>
  );
};

export default DashboardPage;
