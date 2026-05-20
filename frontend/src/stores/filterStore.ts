import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PropertySearchFilters } from '@/types';

interface FilterStore extends PropertySearchFilters {
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
  setOrder: (order: 'asc' | 'desc') => void;
  setMinPrice: (min: number | undefined) => void;
  setMaxPrice: (max: number | undefined) => void;
  setAmenities: (amenities: string[]) => void;
  resetFilters: () => void;
}

const initialState: PropertySearchFilters & { adults: number; children: number; babies: number } = {
  city: '',
  check_in_date: '',
  check_out_date: '',
  capacity: undefined,
  adults: 1,
  children: 0,
  babies: 0,
  search: '',
  category: '',
  page: 1,
  limit: 12,
  sort: 'created_at',
  order: 'desc',
  min_price: undefined,
  max_price: undefined,
  amenities: [],
};

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      ...initialState,

      setCity: (city) => set({ city, page: 1 }),
      setCheckInDate: (date) => set({ check_in_date: date, page: 1 }),
      setCheckOutDate: (date) => set({ check_out_date: date, page: 1 }),
      setAdults: (adults) => set((s) => ({ adults, capacity: adults + s.children, page: 1 })),
      setChildren: (children) => set((s) => ({ children, capacity: s.adults + children, page: 1 })),
      setBabies: (babies) => set({ babies }),
      setCapacity: (capacity) => set({ capacity, page: 1 }),
      setCategory: (category) => set({ category, page: 1 }),
      setSearch: (search) => set({ search, page: 1 }),
      setPage: (page) => set({ page }),
      setSort: (sort) => set({ sort, page: 1 }),
      setOrder: (order) => set({ order, page: 1 }),
      setMinPrice: (min_price) => set({ min_price, page: 1 }),
      setMaxPrice: (max_price) => set({ max_price, page: 1 }),
      setAmenities: (amenities) => set({ amenities, page: 1 }),
      
      resetFilters: () => set(initialState),
    }),
    {
      name: 'property-filter-storage', // name of the item in the storage (must be unique)
    }
  )
);
