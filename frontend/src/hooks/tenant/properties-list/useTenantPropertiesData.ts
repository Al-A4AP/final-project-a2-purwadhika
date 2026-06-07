import { useCallback, useEffect, useState } from "react";
import { tenantService } from "@/services/tenantService";
import type { PaginationMeta, TenantProperty } from "@/types";
import { handlePropertiesError } from "./propertiesError";

type PropertiesFilters = { activeCategoryId: string; activeSearch: string; sortKey: string; sortOrder: "asc" | "desc" };
type SetProperties = (properties: TenantProperty[]) => void;
type SetPagination = (pagination: PaginationMeta) => void;
type SetError = (message: string | null) => void;

const initialPagination: PaginationMeta = { page: 1, limit: 10, total: 0, totalPages: 1 };
const getTenantProperties = (filters: PropertiesFilters, page: number) => tenantService.getProperties({
  search: filters.activeSearch || undefined,
  categoryId: filters.activeCategoryId || undefined,
  sortBy: filters.sortKey,
  sortOrder: filters.sortOrder,
  page,
  limit: 10,
});

export const useTenantPropertiesData = (filters: PropertiesFilters) => {
  const { activeCategoryId, activeSearch, sortKey, sortOrder } = filters;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationMeta>(initialPagination);
  const [properties, setProperties] = useState<TenantProperty[]>([]);
  const fetchProperties = useCallback((pageNumber = 1) => {
    setLoading(true);
    setError(null);
    loadProperties({ activeCategoryId, activeSearch, sortKey, sortOrder }, pageNumber, setProperties, setPagination, setError, setLoading);
  }, [activeCategoryId, activeSearch, sortKey, sortOrder]);
  useEffect(() => { Promise.resolve().then(() => fetchProperties(1)); }, [fetchProperties]);
  return { error, fetchProperties, loading, pagination, properties, setProperties };
};

const loadProperties = (
  filters: PropertiesFilters,
  pageNumber: number,
  setProperties: SetProperties,
  setPagination: SetPagination,
  setError: SetError,
  setLoading: (value: boolean) => void,
) => getTenantProperties(filters, pageNumber)
  .then((data) => { setProperties(data.properties); setPagination(data.pagination); })
  .catch((err) => handlePropertiesError(err, setError, setProperties))
  .finally(() => setLoading(false));
