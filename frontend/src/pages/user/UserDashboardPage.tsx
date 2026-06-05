import type { FC } from "react";
import { SectionLoading } from "@/components/common/SectionLoading";
import { useUserDashboardState } from "./dashboard/useUserDashboardState";
import { DashboardWelcome } from "./dashboard/DashboardWelcome";
import { DashboardUpcomingStay } from "./dashboard/DashboardUpcomingStay";
import { DashboardActiveSummary } from "./dashboard/DashboardActiveSummary";
import { DashboardQuickActions } from "./dashboard/DashboardQuickActions";
import { DashboardRecent } from "./dashboard/DashboardRecent";
import { DashboardReviewReminders } from "./dashboard/DashboardReviewReminders";

const UserDashboardPage: FC = () => {
  const { user, loading, error, stats, upcomingStay, reviewReminders, recentOrders } = useUserDashboardState();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-12 dark:bg-slate-900 pb-24">
      <div className="mx-auto max-w-7xl">
        <DashboardWelcome user={user} />
        
        {loading ? (
          <SectionLoading variant="booking" label="Memuat data dashboard Anda..." />
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 dark:border-red-900/50 dark:bg-red-900/10">
            {error}
          </div>
        ) : (
          <>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DashboardUpcomingStay order={upcomingStay} />
                <DashboardReviewReminders orders={reviewReminders} />
                <DashboardRecent orders={recentOrders} />
              </div>
              <div className="lg:col-span-1">
                <DashboardActiveSummary stats={stats} />
                <DashboardQuickActions />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
