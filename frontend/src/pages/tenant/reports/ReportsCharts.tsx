import type { FC } from "react";
import { OrderStatusPieChart } from "@/components/tenant/OrderStatusPieChart";
import type { DashboardAnalytics } from "@/services/tenantReportService";
import { ChartCard } from "./ChartCard";
import { ReportOrdersCard } from "./ReportOrdersCard";
import { TransactionsBarChart } from "./TransactionsBarChart";
import type { ReportsFilterActions } from "./reportsTypes";

export const ReportsCharts: FC<{ actions: ReportsFilterActions; analytics: DashboardAnalytics }> = ({ actions, analytics }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><ChartCard title="Status Pesanan"><OrderStatusPieChart data={analytics.ordersByStatus} /></ChartCard><ChartCard title="Perbandingan Transaksi"><TransactionsBarChart data={analytics.ordersByStatus} /></ChartCard><ReportOrdersCard analytics={analytics} onPageChange={actions.setReportPage} /></div>
);
