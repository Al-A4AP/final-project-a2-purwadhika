import { api } from './api';
import type { ApiResponse } from '@/types';

interface ReverseGeocodeResponse {
  city: string | null;
}

const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
  const res = await api.get<ApiResponse<ReverseGeocodeResponse>>('/locations/reverse-geocodes', { params: { lat, lon } });
  return res.data.data.city;
};

export const detectCityFromPosition = async (pos: GeolocationPosition): Promise<string | null> => {
  try {
    const { latitude, longitude } = pos.coords;
    return await reverseGeocode(latitude, longitude);
  } catch {
    return null;
  }
};
