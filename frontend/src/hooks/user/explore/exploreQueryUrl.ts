import type { FilterValues } from "@/stores/filterStore";

const EXPLORE_QUERY_FIELDS = [
  "adults",
  "amenities",
  "babies",
  "capacity",
  "category",
  "check_in_date",
  "check_out_date",
  "children",
  "city",
  "limit",
  "max_price",
  "min_price",
  "order",
  "page",
  "search",
  "sort",
] as const;

export const buildExploreUrl = (values: FilterValues) => {
  const query = new URLSearchParams();
  EXPLORE_QUERY_FIELDS.forEach((key) => appendQuery(query, key, values[key]));
  return `/explore${query.toString() ? `?${query}` : ""}`;
};

const appendQuery = (
  query: URLSearchParams,
  key: string,
  value?: number | string | string[],
) => {
  if (value === undefined || value === "" || isEmptyArray(value)) return;
  query.set(key, Array.isArray(value) ? value.join(",") : String(value));
};

const isEmptyArray = (value: number | string | string[]) =>
  Array.isArray(value) && value.length === 0;
