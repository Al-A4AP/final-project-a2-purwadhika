import type { FC } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import type { DashboardAnalytics } from "@/services/tenantReportService";
import { ReportOrderItem } from "./ReportOrderItem";

export const ReportOrdersCard: FC<{ analytics: DashboardAnalytics; onPageChange: (page: number) => void }> = ({ analytics, onPageChange }) => {
  const hasOrders = analytics.recentOrders.length > 0;
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
      <h2 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">Daftar Transaksi Laporan</h2>
      <ReportOrdersList analytics={analytics} />
      {hasOrders && <ReportOrdersPagination analytics={analytics} onPageChange={onPageChange} />}
    </div>
  );
};

const ReportOrdersPagination: FC<{ analytics: DashboardAnalytics; onPageChange: (page: number) => void }> = ({ analytics, onPageChange }) => (
  <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
    <Pagination currentPage={analytics.pagination?.page || 1} totalPages={analytics.pagination?.totalPages || 1} totalItems={analytics.pagination?.total} onPageChange={onPageChange} />
  </div>
);

const ReportOrdersList: FC<{ analytics: DashboardAnalytics }> = ({ analytics }) => {
  if (analytics.recentOrders.length === 0) {
    return (
      <EmptyState 
        className="border-0 bg-transparent px-0 py-10 dark:bg-transparent" 
        title="Belum ada pesanan masuk" 
        description="Transaksi yang sesuai filter laporan akan tampil di sini." 
      />
    );
  }
  return (
    <div className="space-y-1">
      {analytics.recentOrders.map((order) => <ReportOrderItem key={order.id} order={order} />)}
    </div>
  );
};
