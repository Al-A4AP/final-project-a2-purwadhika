import { useCallback, useEffect, useState } from "react";
import { useTenantOrderActions } from "@/hooks/tenant/orders/useTenantOrderActions";
import { orderService } from "@/services/orderService";
import type { Order, PaginationMeta } from "@/types";

const initialPagination = { page: 1, limit: 10, total: 0, totalPages: 1 };

export const usePaymentConfirmationState = () => {
  const ordersState = useConfirmationOrders();
  const refetchCurrent = () => ordersState.fetchOrders(ordersState.pagination.page || 1);
  const actions = useTenantOrderActions(ordersState.orders, refetchCurrent);
  return { ...ordersState, ...actions };
};

const useConfirmationOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(initialPagination);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchOrders = useCallback((page = 1) =>
    loadOrders(page, { setError, setLoading, setOrders, setPagination }), []);
  useInitialFetch(fetchOrders);
  return { error, fetchOrders, loading, orders, pagination };
};

const useInitialFetch = (fetchOrders: (page?: number) => Promise<void>) => {
  useEffect(() => {
    Promise.resolve().then(() => fetchOrders(1));
  }, [fetchOrders]);
};

const loadOrders = async (page: number, actions: LoadOrderActions) => {
  actions.setLoading(true);
  actions.setError(null);
  try {
    const data = await orderService.getTenantOrders({ status: "WAITING_CONFIRMATION", page, limit: 10 });
    actions.setOrders(data.orders);
    actions.setPagination(data.pagination);
  } catch {
    actions.setError("Gagal memuat daftar konfirmasi pembayaran. Silakan coba lagi.");
  } finally {
    actions.setLoading(false);
  }
};

interface LoadOrderActions {
  setError: (value: string | null) => void;
  setLoading: (value: boolean) => void;
  setOrders: (value: Order[]) => void;
  setPagination: (value: PaginationMeta) => void;
}

