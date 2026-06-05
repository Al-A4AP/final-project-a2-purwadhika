import type { FilterStore } from "./filterTypes";

export const FILTER_STORAGE_KEY = "property-filter-storage";

export const selectPersistedFilters = (state: FilterStore): Partial<FilterStore> => ({
  adults: state.adults,
  amenities: state.amenities,
  babies: state.babies,
  capacity: state.capacity,
  category: state.category,
  children: state.children,
  city: state.city,
  limit: state.limit,
  max_price: state.max_price,
  min_price: state.min_price,
  order: state.order,
  sort: state.sort,
});
