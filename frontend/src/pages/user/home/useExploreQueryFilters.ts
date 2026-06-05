import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useFilterStore, type FilterValues } from "@/stores/filterStore";

const QUERY_KEYS = [
  "adults", "amenities", "babies", "capacity", "category", "check_in_date",
  "check_out_date", "children", "city", "limit", "max_price", "min_price",
  "order", "page", "search", "sort",
];

export const useExploreQueryFilters = () => {
  const [searchParams] = useSearchParams();
  const applyFilterValues = useFilterStore((state) => state.applyFilterValues);
  const getFilterValues = useFilterStore((state) => state.getFilterValues);
  const queryKey = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(queryKey);
    if (!hasFilterQuery(params)) return;
    const next = buildQueryFilters(params, getFilterValues());
    if (!sameFilters(next, getFilterValues())) applyFilterValues(next);
  }, [applyFilterValues, getFilterValues, queryKey]);
};

const hasFilterQuery = (params: URLSearchParams) =>
  QUERY_KEYS.some((key) => params.has(key));

const buildQueryFilters = (
  params: URLSearchParams,
  current: FilterValues,
): FilterValues => ({
  ...readGuestFilters(params),
  ...readLocationFilters(params),
  ...readPriceFilters(params),
  ...readPagingFilters(params, current),
});

const readGuestFilters = (params: URLSearchParams) => ({
  adults: readPositiveInt(params, "adults") ?? 1,
  babies: readNonNegativeInt(params, "babies") ?? 0,
  capacity: readPositiveInt(params, "capacity"),
  children: readNonNegativeInt(params, "children") ?? 0,
});

const readLocationFilters = (params: URLSearchParams) => ({
  category: readText(params, "category"),
  check_in_date: readText(params, "check_in_date"),
  check_out_date: readText(params, "check_out_date"),
  city: readText(params, "city"),
  search: readText(params, "search"),
});

const readPriceFilters = (params: URLSearchParams) => ({
  amenities: readAmenities(params),
  max_price: readNonNegativeNumber(params, "max_price"),
  min_price: readNonNegativeNumber(params, "min_price"),
});

const readPagingFilters = (params: URLSearchParams, current: FilterValues) => ({
  limit: readPositiveInt(params, "limit") ?? current.limit,
  order: readOrder(params) ?? current.order,
  page: readPositiveInt(params, "page") ?? 1,
  sort: readText(params, "sort") || current.sort,
});

const readText = (params: URLSearchParams, key: string) =>
  params.get(key)?.trim() || "";

const readOrder = (params: URLSearchParams) => {
  const value = readText(params, "order");
  return value === "asc" || value === "desc" ? value : undefined;
};

const readPositiveInt = (params: URLSearchParams, key: string) => {
  const raw = params.get(key);
  if (!raw) return undefined;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : undefined;
};

const readNonNegativeInt = (params: URLSearchParams, key: string) => {
  const raw = params.get(key);
  if (!raw) return undefined;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? Math.floor(value) : undefined;
};

const readNonNegativeNumber = (params: URLSearchParams, key: string) => {
  const raw = params.get(key);
  if (!raw) return undefined;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : undefined;
};

const readAmenities = (params: URLSearchParams) =>
  params.getAll("amenities").flatMap(splitAmenityList).filter(Boolean);

const splitAmenityList = (value: string) =>
  value.split(",").map((item) => item.trim());

const sameFilters = (left: FilterValues, right: FilterValues) =>
  JSON.stringify(left) === JSON.stringify(right);
