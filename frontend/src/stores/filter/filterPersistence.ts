import type { StateStorage } from "zustand/middleware";
import type { FilterStore } from "./filterTypes";

export const FILTER_STORAGE_KEY = "property-filter-storage";

export const filterSessionStorage: StateStorage = {
  getItem: (name) => readFilterState(name),
  setItem: (name, value) => sessionStorage.setItem(name, value),
  removeItem: (name) => sessionStorage.removeItem(name),
};

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

const readFilterState = (name: string) => {
  const current = sessionStorage.getItem(name);
  const legacy = current ? null : localStorage.getItem(name);
  if (legacy) sessionStorage.setItem(name, legacy);
  localStorage.removeItem(name);
  return current || legacy;
};
