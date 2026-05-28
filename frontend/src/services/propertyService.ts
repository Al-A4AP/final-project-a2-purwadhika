import { api } from "./api";
import type {
  Property,
  PropertyDetail,
  PaginatedResponse,
  PropertySearchFilters,
} from "@/types";
import type { ApiResponse } from "@/types";

export const propertyService = {
  async getProperties(filters: PropertySearchFilters) {
    const params = new URLSearchParams();

    // List field yang valid untuk dikirim
    const validFields = [
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
    ];

    Object.entries(filters).forEach(([key, value]) => {
      if (
        validFields.includes(key) &&
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        params.append(key, String(value));
      }
    });

    const response = await api.get<ApiResponse<PaginatedResponse<Property>>>(
      "/properties?" + params.toString(),
    );
    return response.data.data;
  },

  async getPropertyDetail(
    id: string,
    checkInDate?: string,
    checkOutDate?: string,
  ) {
    const params = new URLSearchParams();
    if (checkInDate) params.append("check_in_date", checkInDate);
    if (checkOutDate) params.append("check_out_date", checkOutDate);
    const queryString = params.toString() ? `?${params.toString()}` : "";

    const response = await api.get<ApiResponse<PropertyDetail>>(
      `/properties/${id}${queryString}`,
    );
    return response.data.data;
  },

  async getPropertyPrices(propertyId: string, month: number, year: number) {
    const response = await api.get(`/properties/${propertyId}/prices`, {
      params: { month, year },
    });
    return response.data.data;
  },

  async getCategories() {
    const response = await api.get("/properties/categories");
    return response.data.data;
  },
};
