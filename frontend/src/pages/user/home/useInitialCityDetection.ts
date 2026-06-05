import { useEffect, useRef } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useFilterStore } from "@/stores/filterStore";

const FALLBACK_CITY = "Bandung";

export const useInitialCityDetection = (enabled = true) => {
  const { detectCity } = useGeolocation();
  const hasRequestedCity = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (hasRequestedCity.current) return;
    hasRequestedCity.current = true;
    const currentFilters = useFilterStore.getState();
    if (currentFilters.city || currentFilters.search) return;
    detectCity().then((city) => applyDetectedCity(city));
  }, [detectCity, enabled]);
};

const applyDetectedCity = (city: string | null) => {
  const currentFilters = useFilterStore.getState();
  currentFilters.setCity(city || FALLBACK_CITY);
  currentFilters.applyFilters();
};
