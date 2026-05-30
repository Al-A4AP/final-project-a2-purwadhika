import axios from 'axios';

const getApiKey = (): string | null =>
  import.meta.env.VITE_LOCATIONIQ_API_KEY || null;

const reverseGeocode = async (lat: number, lon: number, apiKey: string): Promise<string | null> => {
  const url = `https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`;
  const res = await axios.get(url);
  const { address } = res.data;
  return address.city || address.town || address.county || address.state || null;
};

export const detectCityFromPosition = async (pos: GeolocationPosition): Promise<string | null> => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  try {
    const { latitude, longitude } = pos.coords;
    return await reverseGeocode(latitude, longitude, apiKey);
  } catch {
    return null;
  }
};
