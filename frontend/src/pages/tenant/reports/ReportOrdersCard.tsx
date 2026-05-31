import type { FC } from "react";
import { Pagination } from "@/components/common/Pagination";
import type { DashboardAnalytics } from "@/services/tenantReportService";
import { ReportOrderItem } from "./ReportOrderItem";

export const ReportOrdersCard: FC<{ analytics: DashboardAnalytics; onPageChange: (page: number) => void }> = ({ analytics, onPageChange }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden lg:col-span-2"><h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Daftar Transaksi Laporan</h2><ReportOrdersList analytics={analytics} /><Pagination currentPage={analytics.pagination?.page || 1} totalPages={analytics.pagination?.totalPages || 1} totalItems={analytics.pagination?.total} onPageChange={onPageChange} /></div>
);

const ReportOrdersList: FC<{ analytics: DashboardAnalytics }> = ({ analytics }) => {
  if (analytics.recentOrders.length === 0) return <p className="text-sm text-gray-500 py-4">Belum ada pesanan masuk.</p>;
  return <div className="space-y-4">{analytics.recentOrders.map((order) => <ReportOrderItem key={order.id} order={order} />)}</div>;
};
