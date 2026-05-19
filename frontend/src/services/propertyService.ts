import { api } from './api';
import type { Property, PropertyDetail, PaginatedResponse, PropertySearchFilters } from '@/types';
import type { ApiResponse } from '@/types';

export const propertyService = {
  async getProperties(filters: PropertySearchFilters) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await api.get<ApiResponse<PaginatedResponse<Property>>>(
      '/properties?' + params.toString()
    );
    return response.data.data;
  },

  async getPropertyDetail(id: string) {
    const response = await api.get<ApiResponse<PropertyDetail>>(`/properties/${id}`);
    return response.data.data;
  },

  async getPropertyPrices(propertyId: string, month: number, year: number) {
    const response = await api.get(`/properties/${propertyId}/prices`, {
      params: { month, year }
    });
    return response.data.data;
  },

  async getCategories() {
    const response = await api.get('/property-categories');
    return response.data.data;
  },
};
