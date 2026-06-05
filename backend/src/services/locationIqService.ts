import { AppError } from '../middlewares/errorHandler';
import { env } from '../config/env';

interface LocationIqPlace {
  address?: LocationIqAddress;
  lat?: string;
  lon?: string;
}

interface LocationIqAddress {
  city?: string;
  county?: string;
  state?: string;
  town?: string;
}

export const geocodeAddress = async (address: string) => {
  if (!address.trim()) throw new AppError('Lokasi belum tersedia', 400);
  const token = getLocationIqToken();
  const response = await fetch(buildGeocodeUrl(address, token));
  if (!response.ok) throw new AppError('Lokasi belum tersedia', 404);
  const places = await response.json() as LocationIqPlace[];
  return normalizePlace(places);
};

export const reverseGeocodeCoordinates = async (lat: number, lon: number) => {
  const token = getLocationIqToken();
  const response = await fetch(buildReverseGeocodeUrl(lat, lon, token));
  if (!response.ok) throw new AppError('Lokasi belum tersedia', 404);
  const place = await response.json() as LocationIqPlace;
  return { city: normalizeCity(place.address) };
};

const getLocationIqToken = () => {
  if (!env.LOCATIONIQ_TOKEN) throw new AppError('Konfigurasi LocationIQ belum tersedia', 503);
  return env.LOCATIONIQ_TOKEN;
};

const buildGeocodeUrl = (address: string, token: string) =>
  `https://us1.locationiq.com/v1/search?key=${token}&q=${encodeURIComponent(address)}&format=json&limit=1`;

const buildReverseGeocodeUrl = (lat: number, lon: number, token: string) =>
  `https://us1.locationiq.com/v1/reverse?key=${token}&lat=${lat}&lon=${lon}&format=json`;

const normalizePlace = (places: LocationIqPlace[]) => {
  const place = places?.[0];
  if (!place?.lat || !place.lon) throw new AppError('Lokasi belum tersedia', 404);
  return normalizeCoordinate(Number(place.lat), Number(place.lon));
};

const normalizeCoordinate = (latitude: number, longitude: number) => {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) throw new AppError('Lokasi belum tersedia', 404);
  return { latitude, longitude };
};

const normalizeCity = (address?: LocationIqAddress) =>
  address?.city || address?.town || address?.county || address?.state || null;
