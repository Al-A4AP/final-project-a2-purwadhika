import { api } from './api';
import type {
  ApiResponse, DashboardStats, TenantProperty, TenantPropertyDetail,
  RoomWithPeakRates, PeakSeasonRate, RoomFormInput, PaginationMeta,
} from '@/types';

export const tenantService = {
  async getDashboard(): Promise<DashboardStats> {
    const res = await api.get<ApiResponse<DashboardStats>>('/tenant/dashboard');
    return res.data.data;
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
    const res = await api.post<ApiResponse<RoomWithPeakRates>>(`/tenant/properties/${propertyId}/rooms`, data);
    return res.data.data;
  },
  async updateRoom(roomId: string, data: Partial<RoomFormInput>): Promise<RoomWithPeakRates> {
    const res = await api.patch<ApiResponse<RoomWithPeakRates>>(`/tenant/rooms/${roomId}`, data);
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
