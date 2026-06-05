import type { FC } from "react";
import { SectionLoading } from "@/components/common/SectionLoading";
import { useTenantDashboard } from "@/hooks/tenant/tenant-dashboard/useTenantDashboard";
import { HostDashboardHeader } from "./tenant-dashboard/HostDashboardHeader";
import { HostKpiGrid } from "./tenant-dashboard/HostKpiGrid";
import { HostRevenuePanel } from "./tenant-dashboard/HostRevenuePanel";
import { HostRecentReservations } from "./tenant-dashboard/HostRecentReservations";
import { HostOperationsGrid } from "./tenant-dashboard/HostOperationsGrid";

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
        <HostDashboardHeader />
        <HostKpiGrid stats={stats} />
        <HostRevenuePanel revenuePeriod={revenuePeriod} setRevenuePeriod={setRevenuePeriod} revenue={stats?.revenue || 0} />
        <HostRecentReservations orders={stats?.recentOrders} />
        <HostOperationsGrid />
      </div>
    </div>
  );
};

export default DashboardPage;
