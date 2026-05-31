import { useEffect, useRef } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useFilterStore } from "@/stores/filterStore";

export const useInitialCityDetection = () => {
  const { detectCity } = useGeolocation();
  const hasRequestedCity = useRef(false);

  useEffect(() => {
    if (hasRequestedCity.current) return;
    hasRequestedCity.current = true;
    const currentFilters = useFilterStore.getState();
    if (currentFilters.city || currentFilters.search) return;
    detectCity().then((city) => applyDetectedCity(city));
  }, [detectCity]);
};

const applyDetectedCity = (city: string | null) => {
  if (!city) return;
  const currentFilters = useFilterStore.getState();
  currentFilters.setCity(city);
  currentFilters.applyFilters();
};
