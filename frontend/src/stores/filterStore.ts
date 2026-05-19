import { create } from 'zustand';
import type { PropertySearchFilters } from '@/types';

interface FilterStore extends PropertySearchFilters {
  setCity: (city: string) => void;
  setCheckInDate: (date: string) => void;
  setCheckOutDate: (date: string) => void;
  setCapacity: (capacity: number) => void;
  setCategory: (category: string) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setSort: (sort: string) => void;
  setOrder: (order: 'asc' | 'desc') => void;
  resetFilters: () => void;
}

const initialState: PropertySearchFilters = {
  city: '',
  check_in_date: '',
  check_out_date: '',
  capacity: undefined,
  search: '',
  category: '',
  page: 1,
  limit: 12,
  sort: 'created_at',
  order: 'desc',
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,

  setCity: (city) => set({ city, page: 1 }),
  setCheckInDate: (date) => set({ check_in_date: date, page: 1 }),
  setCheckOutDate: (date) => set({ check_out_date: date, page: 1 }),
  setCapacity: (capacity) => set({ capacity, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
  setSort: (sort) => set({ sort, page: 1 }),
  setOrder: (order) => set({ order, page: 1 }),
  
  resetFilters: () => set(initialState),
}));
