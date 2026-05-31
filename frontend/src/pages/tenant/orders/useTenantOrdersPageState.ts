import { useCallback } from "react";
import { useTenantOrderActions } from "./useTenantOrderActions";
import { useTenantOrders } from "./useTenantOrders";

export const useTenantOrdersPageState = () => {
  const ordersState = useTenantOrders();
  const { fetchOrders, orders, pagination } = ordersState;
  const refetch = useCallback(() => fetchOrders(pagination.page), [fetchOrders, pagination.page]);
  const actions = useTenantOrderActions(orders, refetch);
  return { ...ordersState, ...actions };
};
