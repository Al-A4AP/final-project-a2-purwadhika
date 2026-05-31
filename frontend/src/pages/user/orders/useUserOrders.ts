import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { orderService } from "@/services/orderService";
import type { Order, PaginationMeta } from "@/types";
import type { UserOrderFilterActions, UserOrderFilters } from "./userOrdersTypes";

export const useUserOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const filters = useUserOrderFilters();
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const fetchOrders = useFetchUserOrders(filters.values, setOrders, setPagination, setLoading, setError);
  useEffect(() => { Promise.resolve().then(() => fetchOrders()); }, [fetchOrders]);
  return { error, fetchOrders, filterActions: filters.actions, filters: filters.values, loading, orders, pagination };
};

const useUserOrderFilters = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const values = useMemo<UserOrderFilters>(() => ({ endDate, orderNumber, startDate, status }), [endDate, orderNumber, startDate, status]);
  const actions = useMemo<UserOrderFilterActions>(() => ({ setEndDate, setOrderNumber, setStartDate, setStatus }), []);
  return { actions, values };
};

const useFetchUserOrders = (
  filters: UserOrderFilters,
  setOrders: (orders: Order[]) => void,
  setPagination: (pagination: PaginationMeta) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
) => useCallback((page = 1) => {
  setLoading(true);
  setError(null);
  orderService.getUserOrders({ ...filters, page, limit: 10 })
    .then((data) => { setOrders(data.orders); setPagination(data.pagination); })
    .catch((err) => { setError(getApiErrorMessage(err, "Pesanan belum bisa dimuat. Periksa koneksi lalu coba lagi.")); setOrders([]); })
    .finally(() => setLoading(false));
}, [filters, setError, setLoading, setOrders, setPagination]);
