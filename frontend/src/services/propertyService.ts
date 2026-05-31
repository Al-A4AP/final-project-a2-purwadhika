import { api } from "./api";
import { buildUrl } from "./api/queryParams";
import type { ApiResponse, PaginatedResponse, Property, PropertyDetail, PropertySearchFilters } from "@/types";

const propertyFilterFields = [
  "page",
  "limit",
  "sort",
  "order",
  "search",
  "category",
  "city",
  "check_in_date",
  "check_out_date",
  "capacity",
  "adults",
  "children",
  "babies",
  "min_price",
  "max_price",
  "amenities",
] as const;

export const propertyService = {
  async getProperties(filters: PropertySearchFilters) {
    const response = await api.get<ApiResponse<PaginatedResponse<Property>>>(
      buildUrl("/properties", filters, propertyFilterFields),
    );
    return response.data.data;
  },

  async getPropertyDetail(id: string, checkInDate?: string, checkOutDate?: string) {
    const response = await api.get<ApiResponse<PropertyDetail>>(
      buildUrl(`/properties/${id}`, { check_in_date: checkInDate, check_out_date: checkOutDate }),
    );
    return response.data.data;
  },

  async getPropertyPrices(propertyId: string, month: number, year: number) {
    const response = await api.get(`/properties/${propertyId}/prices`, { params: { month, year } });
    return response.data.data;
  },

  async getCategories() {
    const response = await api.get("/properties/categories");
    return response.data.data;
  },
};
