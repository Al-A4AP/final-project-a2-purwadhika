type QueryValue = string | number | boolean | string[] | number[] | null | undefined;

export const buildUrl = (path: string, params?: object, allowedFields?: readonly string[]) => {
  const queryString = buildQueryString(params, allowedFields);
  return queryString ? `${path}?${queryString}` : path;
};

export const buildQueryString = (params?: object, allowedFields?: readonly string[]) => {
  const query = new URLSearchParams();
  const allowed = allowedFields ? new Set(allowedFields) : null;
  Object.entries(params || {}).forEach(([key, value]) => appendQueryParam(query, key, value as QueryValue, allowed));
  return query.toString();
};

const appendQueryParam = (query: URLSearchParams, key: string, value: QueryValue, allowed: Set<string> | null) => {
  if (allowed && !allowed.has(key)) return;
  if (isEmptyQueryValue(value)) return;
  query.append(key, Array.isArray(value) ? value.join(",") : String(value));
};

const isEmptyQueryValue = (value: QueryValue) =>
  value === undefined || value === null || value === "";
