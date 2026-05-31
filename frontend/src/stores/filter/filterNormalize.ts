import type { FilterStore, FilterValues } from "./filterTypes";

export const normalizePrice = (value?: number) =>
  value === undefined ? undefined : Math.max(0, Number(value));

export const normalizeFilters = (values: FilterValues): FilterValues => ({
  ...values,
  amenities: values.amenities || [],
  max_price: normalizePrice(values.max_price),
  min_price: normalizePrice(values.min_price),
  order: values.order || "desc",
  page: values.page || 1,
  sort: values.sort || "created_at",
});

export const selectFilterValues = (state: FilterStore): FilterValues => ({
  ...selectPagingFilters(state),
  ...selectSearchFilters(state),
  ...selectGuestFilters(state),
  ...selectPriceFilters(state),
});

const selectPagingFilters = (state: FilterStore) => ({
  page: state.page || 1,
  limit: state.limit || 8,
  sort: state.sort || "created_at",
  order: state.order || "desc",
});
const selectSearchFilters = (state: FilterStore) => ({
  search: state.search || "",
  city: state.city || "",
  category: state.category || "",
  check_in_date: state.check_in_date || "",
  check_out_date: state.check_out_date || "",
});
const selectGuestFilters = (state: FilterStore) => ({
  adults: state.adults || 1,
  children: state.children || 0,
  babies: state.babies || 0,
  capacity: state.capacity,
});
const selectPriceFilters = (state: FilterStore) => ({
  min_price: normalizePrice(state.min_price),
  max_price: normalizePrice(state.max_price),
  amenities: state.amenities || [],
});
