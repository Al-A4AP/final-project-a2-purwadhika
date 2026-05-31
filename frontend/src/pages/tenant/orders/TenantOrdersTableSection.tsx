import type { FC } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Pagination } from "@/components/common/Pagination";
import { OrdersTable } from "@/components/tenant/OrdersTable";
import type { TenantOrdersState } from "./tenantOrdersTypes";

export const TenantOrdersTableSection: FC<{ state: TenantOrdersState }> = ({ state }) => {
  if (state.loading) return <div className="p-10 text-center text-gray-500 dark:text-gray-400">Memuat data...</div>;
  if (state.error) return <ErrorState title="Pesanan belum bisa dimuat" message={state.error} onRetry={() => state.fetchOrders(state.pagination.page || 1)} />;
  if (!state.orders.length) return <EmptyOrders />;
  const totalPages = state.pagination.totalPages || state.pagination.pages || 1;
  return (
    <div className="rounded-xl md:border md:bg-white md:shadow-sm md:dark:border-slate-700 md:dark:bg-slate-800 md:overflow-hidden">
      <OrdersTable orders={state.orders} updating={state.updating} handleUpdateStatus={state.handleUpdateStatus} />
      <Pagination currentPage={state.pagination.page || 1} totalPages={totalPages} totalItems={state.pagination.total} onPageChange={state.fetchOrders} />
    </div>
  );
};

const EmptyOrders: FC = () => (
  <EmptyState title="Belum ada pesanan masuk" description="Pesanan dari properti Anda akan muncul di halaman ini." />
);
