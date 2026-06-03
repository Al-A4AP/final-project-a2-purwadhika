import { api } from './api';
import type {
  ApiResponse, DashboardStats, TenantProperty, TenantPropertyDetail,
  RoomWithPeakRates, PeakSeasonRate, RoomFormInput, PaginationMeta, PropertyCategory, DashboardRevenuePeriod,
  PropertyImage, RoomImage
} from '@/types';

const buildUrl = (path: string, params?: Record<string, unknown>) => {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.append(key, String(value));
  });
  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
};

const buildRoomFormData = (data: Partial<RoomFormInput>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'image' || value === undefined || value === null) return;
    formData.append(key, String(value));
  });
  if (data.image) formData.append('image', data.image);
  return formData;
};

export const tenantService = {
  async getDashboard(params?: { revenuePeriod?: DashboardRevenuePeriod }): Promise<DashboardStats> {
    const res = await api.get<ApiResponse<DashboardStats>>(buildUrl('/tenants/me/dashboard', params));
    return res.data.data;
  },
  async getOccupancyCalendar() {
    const response = await api.get('/tenants/me/reports/occupancy');
    return response.data.data;
  },
  async getReviews(params?: { page?: number; limit?: number }) {
    const response = await api.get('/tenants/me/reviews', { params });
    return response.data.data;
  },
  async replyToReview(reviewId: string, reply_text: string) {
    const response = await api.post(`/reviews/${reviewId}/reply`, { reply_text });
    return response.data.data;
  },
  async deleteReview(reviewId: string): Promise<void> {
    await api.delete(`/reviews/${reviewId}`);
  },
  async getProperties(params?: {
    search?: string;
    categoryId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{ properties: TenantProperty[]; pagination: PaginationMeta }> {
    const res = await api.get<ApiResponse<{ properties: TenantProperty[]; pagination: PaginationMeta }>>(buildUrl('/tenants/me/properties', params));
    return res.data.data;
  },
  async getCategories(params?: {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{ categories: PropertyCategory[]; pagination: PaginationMeta }> {
    const res = await api.get<ApiResponse<{ categories: PropertyCategory[]; pagination: PaginationMeta }>>(buildUrl('/tenants/me/categories', params));
    return res.data.data;
  },
  async createCategory(name: string): Promise<PropertyCategory> {
    const res = await api.post<ApiResponse<PropertyCategory>>('/tenants/me/categories', { name });
    return res.data.data;
  },
  async updateCategory(id: string, name: string): Promise<PropertyCategory> {
    const res = await api.patch<ApiResponse<PropertyCategory>>(`/tenants/me/categories/${id}`, { name });
    return res.data.data;
  },
  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/tenants/me/categories/${id}`);
  },
  async getProperty(id: string): Promise<TenantPropertyDetail> {
    const res = await api.get<ApiResponse<TenantPropertyDetail>>(`/tenants/me/properties/${id}`);
    return res.data.data;
  },
  async createProperty(formData: FormData): Promise<TenantProperty> {
    const res = await api.post<ApiResponse<TenantProperty>>('/tenants/me/properties', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  async updateProperty(id: string, formData: FormData): Promise<TenantProperty> {
    const res = await api.patch<ApiResponse<TenantProperty>>(`/tenants/me/properties/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  async deleteProperty(id: string): Promise<void> {
    await api.delete(`/tenants/me/properties/${id}`);
  },
  async getRooms(propertyId: string): Promise<RoomWithPeakRates[]> {
    const res = await api.get<ApiResponse<RoomWithPeakRates[]>>(`/tenants/me/properties/${propertyId}/rooms`);
    return res.data.data;
  },
  async createRoom(propertyId: string, data: RoomFormInput): Promise<RoomWithPeakRates> {
    const res = await api.post<ApiResponse<RoomWithPeakRates>>(`/tenants/me/properties/${propertyId}/rooms`, buildRoomFormData(data), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  async updateRoom(roomId: string, data: Partial<RoomFormInput>): Promise<RoomWithPeakRates> {
    const res = await api.patch<ApiResponse<RoomWithPeakRates>>(`/tenants/me/rooms/${roomId}`, buildRoomFormData(data), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  async deleteRoom(roomId: string): Promise<void> {
    await api.delete(`/tenants/me/rooms/${roomId}`);
  },
  async getPeakRates(roomId: string): Promise<PeakSeasonRate[]> {
    const res = await api.get<ApiResponse<PeakSeasonRate[]>>(`/tenants/me/rooms/${roomId}/peak-rates`);
    return res.data.data;
  },
  async createPeakRate(roomId: string, data: Record<string, string>): Promise<PeakSeasonRate> {
    const res = await api.post<ApiResponse<PeakSeasonRate>>(`/tenants/me/rooms/${roomId}/peak-rates`, data);
    return res.data.data;
  },
  async updatePeakRate(rateId: string, data: Record<string, string>): Promise<PeakSeasonRate> {
    const res = await api.patch<ApiResponse<PeakSeasonRate>>(`/tenants/me/peak-rates/${rateId}`, data);
    return res.data.data;
  },
  async deletePeakRate(rateId: string): Promise<void> {
    await api.delete(`/tenants/me/peak-rates/${rateId}`);
  },
  async addPropertyImage(propertyId: string, file: File): Promise<PropertyImage> {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post<ApiResponse<PropertyImage>>(`/tenants/me/properties/${propertyId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  async deletePropertyImage(propertyId: string, imageId: string): Promise<void> {
    await api.delete(`/tenants/me/properties/${propertyId}/images/${imageId}`);
  },
  async addRoomImage(roomId: string, file: File): Promise<RoomImage> {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post<ApiResponse<RoomImage>>(`/tenants/me/rooms/${roomId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  async deleteRoomImage(roomId: string, imageId: string): Promise<void> {
    await api.delete(`/tenants/me/rooms/${roomId}/images/${imageId}`);
  },
  async setRoomMainImage(roomId: string, imageId: string): Promise<void> {
    await api.patch(`/tenants/me/rooms/${roomId}/images/${imageId}/main`);
  },
};
