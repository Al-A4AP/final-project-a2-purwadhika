import { AppError } from '../middlewares/errorHandler';

interface LocationIqPlace {
  lat?: string;
  lon?: string;
}

export const geocodeAddress = async (address: string) => {
  if (!address.trim()) throw new AppError('Lokasi belum tersedia', 400);
  const token = getLocationIqToken();
  const response = await fetch(buildGeocodeUrl(address, token));
  if (!response.ok) throw new AppError('Lokasi belum tersedia', 404);
  const places = await response.json() as LocationIqPlace[];
  return normalizePlace(places);
};

const getLocationIqToken = () => {
  if (!process.env.LOCATIONIQ_TOKEN) throw new AppError('Konfigurasi LocationIQ belum tersedia', 503);
  return process.env.LOCATIONIQ_TOKEN;
};

const buildGeocodeUrl = (address: string, token: string) =>
  `https://us1.locationiq.com/v1/search?key=${token}&q=${encodeURIComponent(address)}&format=json&limit=1`;

const normalizePlace = (places: LocationIqPlace[]) => {
  const place = places?.[0];
  if (!place?.lat || !place.lon) throw new AppError('Lokasi belum tersedia', 404);
  return normalizeCoordinate(Number(place.lat), Number(place.lon));
};

const normalizeCoordinate = (latitude: number, longitude: number) => {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) throw new AppError('Lokasi belum tersedia', 404);
  return { latitude, longitude };
};
