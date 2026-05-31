import type { FC } from "react";
import { Pagination } from "@/components/common/Pagination";
import { OrdersTable } from "@/components/tenant/OrdersTable";
import type { TenantOrdersState } from "./tenantOrdersTypes";

export const TenantOrdersTableSection: FC<{ state: TenantOrdersState }> = ({ state }) => {
  if (state.loading) return <div className="p-10 text-center text-gray-500 dark:text-gray-400">Memuat data...</div>;
  const totalPages = state.pagination.totalPages || state.pagination.pages || 1;
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden">
      <OrdersTable orders={state.orders} updating={state.updating} handleUpdateStatus={state.handleUpdateStatus} />
      <Pagination currentPage={state.pagination.page || 1} totalPages={totalPages} totalItems={state.pagination.total} onPageChange={state.fetchOrders} />
    </div>
  );
};
