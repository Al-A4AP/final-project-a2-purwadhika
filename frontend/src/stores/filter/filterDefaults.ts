import type { FilterValues } from "./filterTypes";
import type { PropertySearchFilters } from "@/types";

export const initialState: PropertySearchFilters & { adults: number; children: number; babies: number } = {
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

export const initialFilterValues: FilterValues = {
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
