import { normalizePrice } from "./filterNormalize";
import type { FilterSet } from "./filterTypes";

export const createFilterSetters = (set: FilterSet) => ({
  ...createLocationSetters(set),
  ...createGuestSetters(set),
  ...createSortingSetters(set),
  ...createPriceSetters(set),
});

const createLocationSetters = (set: FilterSet) => ({
  setCity: (city: string) => set({ city, page: 1 }),
  setCheckInDate: (date: string) => set({ check_in_date: date, page: 1 }),
  setCheckOutDate: (date: string) => set({ check_out_date: date, page: 1 }),
  setCategory: (category: string) => set({ category, page: 1 }),
  setSearch: (search: string) => set({ search, page: 1 }),
});
const createGuestSetters = (set: FilterSet) => ({
  setAdults: (adults: number) => set((state) => ({
    adults,
    babies: Math.min(state.babies, adults),
    capacity: adults,
    children: Math.min(state.children, adults),
    page: 1,
  })),
  setChildren: (children: number) => set((state) => ({ children: Math.min(children, state.adults), capacity: state.adults, page: 1 })),
  setBabies: (babies: number) => set((state) => ({ babies: Math.min(babies, state.adults) })),
  setCapacity: (capacity: number) => set({ capacity, page: 1 }),
});
const createSortingSetters = (set: FilterSet) => ({
  setPage: (page: number) => set({ page }),
  setSort: (sort: string) => set({ sort, page: 1 }),
  setOrder: (order: "asc" | "desc") => set({ order, page: 1 }),
});
const createPriceSetters = (set: FilterSet) => ({
  setMinPrice: (min_price?: number) => set({ min_price: normalizePrice(min_price), page: 1 }),
  setMaxPrice: (max_price?: number) => set({ max_price: normalizePrice(max_price), page: 1 }),
  setAmenities: (amenities: string[]) => set({ amenities, page: 1 }),
});
