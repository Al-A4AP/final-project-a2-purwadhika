import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { orderService } from "@/services/orderService";
import type { UserOrderParams } from "@/services/orderService";
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
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [status, setStatus] = useState("");
  const resetFilters = useCallback(() => { setCheckInDate(""); setCheckOutDate(""); setOrderNumber(""); setStatus(""); }, []);
  const values = useMemo<UserOrderFilters>(() => ({ checkInDate, checkOutDate, orderNumber, status }), [checkInDate, checkOutDate, orderNumber, status]);
  const actions = useMemo<UserOrderFilterActions>(() => ({ resetFilters, setCheckInDate, setCheckOutDate, setOrderNumber, setStatus }), [resetFilters]);
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
  orderService.getUserOrders(buildUserOrderParams(filters, page))
    .then((data) => { setOrders(data.orders); setPagination(data.pagination); })
    .catch((err) => { setError(getApiErrorMessage(err, "Pesanan belum bisa dimuat. Periksa koneksi lalu coba lagi.")); setOrders([]); })
    .finally(() => setLoading(false));
}, [filters, setError, setLoading, setOrders, setPagination]);

const buildUserOrderParams = (filters: UserOrderFilters, page: number): UserOrderParams => ({
  check_in_date: filters.checkInDate,
  check_out_date: filters.checkOutDate,
  limit: 10,
  orderNumber: filters.orderNumber,
  page,
  status: filters.status,
});
