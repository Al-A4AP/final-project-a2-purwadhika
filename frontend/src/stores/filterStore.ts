import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PropertySearchFilters } from "@/types";

export type FilterValues = {
  page: number;
  limit: number;
  sort: string;
  order: "asc" | "desc";
  search: string;
  city: string;
  category: string;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children: number;
  babies: number;
  capacity?: number;
  min_price?: number;
  max_price?: number;
  amenities: string[];
};

interface FilterStore extends PropertySearchFilters {
  appliedAt: number;
  activeFilters: FilterValues;
  adults: number;
  children: number;
  babies: number;
  setCity: (city: string) => void;
  setCheckInDate: (date: string) => void;
  setCheckOutDate: (date: string) => void;
  setCapacity: (capacity: number) => void;
  setAdults: (n: number) => void;
  setChildren: (n: number) => void;
  setBabies: (n: number) => void;
  setCategory: (category: string) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setSort: (sort: string) => void;
  setOrder: (order: "asc" | "desc") => void;
  setMinPrice: (min: number | undefined) => void;
  setMaxPrice: (max: number | undefined) => void;
  setAmenities: (amenities: string[]) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  getFilterValues: () => FilterValues;
}

const initialState: PropertySearchFilters & {
  adults: number;
  children: number;
  babies: number;
} = {
  city: "",
  check_in_date: "",
  check_out_date: "",
  capacity: undefined,
  adults: 1,
  children: 0,
  babies: 0,
  search: "",
  category: "",
  page: 1,
  limit: 8,
  sort: "created_at",
  order: "desc",
  min_price: undefined,
  max_price: undefined,
  amenities: [],
};

const initialFilterValues: FilterValues = {
  page: 1,
  limit: 8,
  sort: "created_at",
  order: "desc",
  search: "",
  city: "",
  category: "",
  check_in_date: "",
  check_out_date: "",
  adults: 1,
  children: 0,
  babies: 0,
  capacity: undefined,
  min_price: undefined,
  max_price: undefined,
  amenities: [],
};

const normalizePrice = (value?: number) =>
  value === undefined ? undefined : Math.max(0, Number(value));

export const useFilterStore = create<FilterStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      appliedAt: 0,
      activeFilters: initialFilterValues,

      setCity: (city) => set({ city, page: 1 }),
      setCheckInDate: (date) => set({ check_in_date: date, page: 1 }),
      setCheckOutDate: (date) => set({ check_out_date: date, page: 1 }),
      setAdults: (adults) =>
        set((s) => ({ adults, capacity: adults + s.children, page: 1 })),
      setChildren: (children) =>
        set((s) => ({ children, capacity: s.adults + children, page: 1 })),
      setBabies: (babies) => set({ babies }),
      setCapacity: (capacity) => set({ capacity, page: 1 }),
      setCategory: (category) => set({ category, page: 1 }),
      setSearch: (search) => set({ search, page: 1 }),
      setPage: (page) => set({ page }),
      setSort: (sort) => set({ sort, page: 1 }),
      setOrder: (order) => set({ order, page: 1 }),
      setMinPrice: (min_price) => set({ min_price: normalizePrice(min_price), page: 1 }),
      setMaxPrice: (max_price) => set({ max_price: normalizePrice(max_price), page: 1 }),
      setAmenities: (amenities) => set({ amenities, page: 1 }),
      applyFilters: () => set({ activeFilters: get().getFilterValues(), appliedAt: Date.now() }),

      resetFilters: () => set({ ...initialState, activeFilters: initialFilterValues, appliedAt: Date.now() }),

      getFilterValues: (): FilterValues => {
        const s = get();
        return {
          page: s.page || 1,
          limit: s.limit || 8,
          sort: s.sort || "created_at",
          order: s.order || "desc",
          search: s.search || "",
          city: s.city || "",
          category: s.category || "",
          check_in_date: s.check_in_date || "",
          check_out_date: s.check_out_date || "",
          adults: s.adults || 1,
          children: s.children || 0,
          babies: s.babies || 0,
          capacity: s.capacity,
          min_price: normalizePrice(s.min_price),
          max_price: normalizePrice(s.max_price),
          amenities: s.amenities || [],
        };
      },
    }),
    {
      name: "property-filter-storage", // name of the item in the storage (must be unique)
    },
  ),
);
