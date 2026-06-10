import type { FC } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Pagination } from "@/components/common/Pagination";
import { SectionLoading } from "@/components/common/SectionLoading";
import { OrdersTable } from "@/components/tenant/OrdersTable";
import type { TenantOrdersState } from "@/hooks/tenant/orders/tenantOrdersTypes";

export const TenantOrdersTableSection: FC<{ state: TenantOrdersState }> = ({ state }) => {
  if (state.loading) return <SectionLoading label="Memuat data pesanan..." size="md" variant="table" />;
  if (state.error) return <ErrorState title="Pesanan belum bisa dimuat" message={state.error} onRetry={() => state.fetchOrders(state.pagination.page || 1)} />;
  if (!state.orders.length) return <EmptyOrders />;
  const totalPages = state.pagination.totalPages || state.pagination.pages || 1;
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:overflow-hidden">
      <OrdersTable orders={state.orders} updating={state.updating} handleUpdateStatus={state.handleUpdateStatus} handleMarkRefundComplete={state.handleMarkRefundComplete} />
      <div className="border-t border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
        <Pagination currentPage={state.pagination.page || 1} totalPages={totalPages} totalItems={state.pagination.total} onPageChange={state.fetchOrders} />
      </div>
    </div>
  );
};

const EmptyOrders: FC = () => (
  <EmptyState title="Belum ada pesanan masuk" description="Pesanan dari properti Anda akan muncul di halaman ini." />
);
