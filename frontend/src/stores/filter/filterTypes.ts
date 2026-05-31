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

export interface FilterStore extends PropertySearchFilters {
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
  applyFilterValues: (values: FilterValues) => void;
  resetFilters: () => void;
  getFilterValues: () => FilterValues;
}

export type FilterSet = (partial: Partial<FilterStore> | ((state: FilterStore) => Partial<FilterStore>)) => void;
export type FilterGet = () => FilterStore;
