import { api } from './api';
import type { ApiResponse } from '@/types';


export interface RoomAvailability {
  id: string;
  roomId: string;
  date: string;
  is_available: boolean;
}

export const availabilityService = {
  async getRoomAvailability(roomId: string, params?: { start_date?: string; end_date?: string }): Promise<RoomAvailability[]> {
    const res = await api.get<ApiResponse<RoomAvailability[]>>(`/properties/rooms/${roomId}/availability`, { params });
    return res.data.data;
  },

  async getTenantRoomAvailability(roomId: string): Promise<RoomAvailability[]> {
    const res = await api.get<ApiResponse<RoomAvailability[]>>(`/tenant/rooms/${roomId}/availability`);
    return res.data.data;
  },

  async setRoomAvailability(roomId: string, date: string, is_available: boolean): Promise<null> {
    const res = await api.post<ApiResponse<null>>(`/tenant/rooms/${roomId}/availability`, { date, is_available });
    return res.data.data;
  }
};
