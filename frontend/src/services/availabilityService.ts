import { api } from './api';
import type { ApiResponse } from '@/types';


export type AvailabilitySource = 'TENANT_AVAILABLE' | 'TENANT_BLOCKED' | 'CUSTOMER_BOOKED';

export interface RoomAvailability {
  id: string;
  roomId: string;
  date: string;
  is_available: boolean;
  source?: AvailabilitySource;
}

export interface AvailabilityRangeInput {
  start_date: string;
  end_date: string;
  is_available: boolean;
}

export const availabilityService = {
  async getRoomAvailability(roomId: string, params?: { start_date?: string; end_date?: string }): Promise<RoomAvailability[]> {
    const res = await api.get<ApiResponse<RoomAvailability[]>>(`/rooms/${roomId}/availability`, { params });
    return res.data.data;
  },

  async getTenantRoomAvailability(roomId: string): Promise<RoomAvailability[]> {
    const res = await api.get<ApiResponse<RoomAvailability[]>>(`/tenants/me/rooms/${roomId}/availability`);
    return res.data.data;
  },

  async setRoomAvailability(roomId: string, date: string, is_available: boolean): Promise<null> {
    const res = await api.post<ApiResponse<null>>(`/tenants/me/rooms/${roomId}/availability`, { date, is_available });
    return res.data.data;
  },

  async setRoomAvailabilityRange(roomId: string, data: AvailabilityRangeInput): Promise<RoomAvailability[]> {
    const res = await api.post<ApiResponse<RoomAvailability[]>>(`/tenants/me/rooms/${roomId}/availability/range`, data);
    return res.data.data;
  }
};
