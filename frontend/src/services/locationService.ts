import { api } from "./api";
import type { ApiResponse } from "@/types";

export interface LocationPoint {
  latitude: number;
  longitude: number;
}

export const locationService = {
  async geocode(address: string): Promise<LocationPoint | null> {
    if (!address.trim()) return null;
    const response = await api.get<ApiResponse<LocationPoint>>("/locations/geocodes", { params: { address } });
    return response.data.data;
  },
};
