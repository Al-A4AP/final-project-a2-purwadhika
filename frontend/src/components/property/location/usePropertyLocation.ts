import { useEffect, useMemo, useState } from "react";
import { locationService, type LocationPoint } from "@/services/locationService";

interface LocationInput {
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
}

export const usePropertyLocation = (input: LocationInput) => {
  const { address, city, latitude, longitude } = input;
  const initial = useMemo(() => getInitialPoint(latitude, longitude), [latitude, longitude]);
  const addressQuery = useMemo(() => buildAddress(address, city), [address, city]);
  const [point, setPoint] = useState<LocationPoint | null>(initial);
  const [loading, setLoading] = useState(!initial);
  useEffect(() => { loadPoint(addressQuery, initial, setPoint, setLoading); }, [addressQuery, initial]);
  return { loading, point };
};

const getInitialPoint = (latitude?: number, longitude?: number): LocationPoint | null => {
  if (typeof latitude !== "number" || typeof longitude !== "number") return null;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  return { latitude, longitude };
};

const loadPoint = (
  address: string,
  initial: LocationPoint | null,
  setPoint: (point: LocationPoint | null) => void,
  setLoading: (loading: boolean) => void,
) => {
  if (initial) return applyInitialPoint(initial, setPoint, setLoading);
  setLoading(true);
  locationService.geocode(address).then(setPoint).catch(() => setPoint(null)).finally(() => setLoading(false));
};

const applyInitialPoint = (
  initial: LocationPoint,
  setPoint: (point: LocationPoint | null) => void,
  setLoading: (loading: boolean) => void,
) => { setPoint(initial); setLoading(false); };

const buildAddress = (address: string, city: string) =>
  [address, city, "Indonesia"].filter(Boolean).join(", ");
