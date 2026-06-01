import type { FC } from "react";
import { HelpText } from "@/components/common/HelpText";
import { DashboardHeader } from "./tenant-dashboard/DashboardHeader";
import { DashboardLoading } from "./tenant-dashboard/DashboardLoading";
import { DashboardRevenuePeriodSelect } from "./tenant-dashboard/DashboardRevenuePeriodSelect";
import { DashboardStatGrid } from "./tenant-dashboard/DashboardStatGrid";
import { RecentOrdersCard } from "./tenant-dashboard/RecentOrdersCard";
import { useTenantDashboard } from "./tenant-dashboard/useTenantDashboard";

const DashboardPage: FC = () => {
  const { loading, revenuePeriod, setRevenuePeriod, stats } = useTenantDashboard();
  if (loading) return <DashboardLoading />;
  return (
    <div className="space-y-6 p-4 md:space-y-8 md:p-8">
      <DashboardHeader />
      <HelpText>Angka perlu konfirmasi membantu Anda menemukan pembayaran manual yang harus ditinjau lebih dulu.</HelpText>
      <DashboardRevenuePeriodSelect value={revenuePeriod} onChange={setRevenuePeriod} />
      <DashboardStatGrid stats={stats} revenuePeriod={revenuePeriod} />
      <RecentOrdersCard orders={stats?.recentOrders} />
    </div>
  );
};

export default DashboardPage;
