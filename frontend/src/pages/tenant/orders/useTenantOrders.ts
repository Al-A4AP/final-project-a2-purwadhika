import { useCallback, useEffect, useState } from "react";
import { orderService } from "@/services/orderService";
import { tenantService } from "@/services/tenantService";
import type { Order, PaginationMeta, TenantProperty } from "@/types";
import { useTenantOrderFilters } from "./useTenantOrderFilters";
import type { TenantOrderFilters } from "./tenantOrdersTypes";

export const useTenantOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [properties, setProperties] = useState<TenantProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const filters = useTenantOrderFilters();
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const fetchOrders = useFetchTenantOrders(filters.values, setOrders, setPagination, setLoading);
  useLoadTenantProperties(setProperties);
  useEffect(() => { Promise.resolve().then(() => fetchOrders(1)); }, [fetchOrders]);
  return { fetchOrders, filterActions: filters.actions, filters: filters.values, loading, orders, pagination, properties };
};

const useLoadTenantProperties = (setProperties: (properties: TenantProperty[]) => void) => {
  useEffect(() => { tenantService.getProperties({ limit: 100 }).then((data) => setProperties(data.properties)).catch(() => {}); }, [setProperties]);
};

const useFetchTenantOrders = (
  filters: TenantOrderFilters,
  setOrders: (orders: Order[]) => void,
  setPagination: (pagination: PaginationMeta) => void,
  setLoading: (loading: boolean) => void,
) => useCallback((page = 1) => {
  setLoading(true);
  orderService.getTenantOrders(buildTenantOrderParams(filters, page))
    .then((data) => { setOrders(data.orders); setPagination(data.pagination); })
    .finally(() => setLoading(false));
}, [filters, setLoading, setOrders, setPagination]);

const buildTenantOrderParams = (filters: TenantOrderFilters, page: number) => ({
  propertyId: filters.selectedPropertyId || undefined,
  status: filters.selectedStatus || undefined,
  startDate: filters.startDate || undefined,
  endDate: filters.endDate || undefined,
  sortBy: filters.sortBy,
  sortOrder: filters.sortOrder,
  page,
  limit: 10,
});
