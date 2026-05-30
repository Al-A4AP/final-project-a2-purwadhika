import { api } from './api';
import type {
  ApiResponse, DashboardStats, TenantProperty, TenantPropertyDetail,
  RoomWithPeakRates, PeakSeasonRate, RoomFormInput, PaginationMeta,
} from '@/types';

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
  async getDashboard(): Promise<DashboardStats> {
    const res = await api.get<ApiResponse<DashboardStats>>('/tenant/dashboard');
    return res.data.data;
  },
  async getOccupancyCalendar() {
    const response = await api.get('/tenant/reports/occupancy');
    return response.data.data;
  },
  async getReviews(params?: { page?: number; limit?: number }) {
    const response = await api.get('/tenant/reviews', { params });
    return response.data.data;
  },
  async replyToReview(reviewId: string, reply_text: string) {
    const response = await api.post(`/reviews/${reviewId}/reply`, { reply_text });
    return response.data.data;
  },
  async getProperties(params?: {
    search?: string;
    categoryId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{ properties: TenantProperty[]; pagination: PaginationMeta }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined) query.append(key, String(val));
      });
    }
    const res = await api.get<ApiResponse<{ properties: TenantProperty[]; pagination: PaginationMeta }>>(`/tenant/properties?${query.toString()}`);
    return res.data.data;
  },
  async getProperty(id: string): Promise<TenantPropertyDetail> {
    const res = await api.get<ApiResponse<TenantPropertyDetail>>(`/tenant/properties/${id}`);
    return res.data.data;
  },
  async createProperty(formData: FormData): Promise<TenantProperty> {
    const res = await api.post<ApiResponse<TenantProperty>>('/tenant/properties', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  async updateProperty(id: string, formData: FormData): Promise<TenantProperty> {
    const res = await api.patch<ApiResponse<TenantProperty>>(`/tenant/properties/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  async deleteProperty(id: string): Promise<void> {
    await api.delete(`/tenant/properties/${id}`);
  },
  async getRooms(propertyId: string): Promise<RoomWithPeakRates[]> {
    const res = await api.get<ApiResponse<RoomWithPeakRates[]>>(`/tenant/properties/${propertyId}/rooms`);
    return res.data.data;
  },
  async createRoom(propertyId: string, data: RoomFormInput): Promise<RoomWithPeakRates> {
    const res = await api.post<ApiResponse<RoomWithPeakRates>>(`/tenant/properties/${propertyId}/rooms`, buildRoomFormData(data), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  async updateRoom(roomId: string, data: Partial<RoomFormInput>): Promise<RoomWithPeakRates> {
    const res = await api.patch<ApiResponse<RoomWithPeakRates>>(`/tenant/rooms/${roomId}`, buildRoomFormData(data), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  async deleteRoom(roomId: string): Promise<void> {
    await api.delete(`/tenant/rooms/${roomId}`);
  },
  async getPeakRates(roomId: string): Promise<PeakSeasonRate[]> {
    const res = await api.get<ApiResponse<PeakSeasonRate[]>>(`/tenant/rooms/${roomId}/peak-rates`);
    return res.data.data;
  },
  async createPeakRate(roomId: string, data: Record<string, string>): Promise<PeakSeasonRate> {
    const res = await api.post<ApiResponse<PeakSeasonRate>>(`/tenant/rooms/${roomId}/peak-rates`, data);
    return res.data.data;
  },
  async deletePeakRate(rateId: string): Promise<void> {
    await api.delete(`/tenant/peak-rates/${rateId}`);
  },
};
