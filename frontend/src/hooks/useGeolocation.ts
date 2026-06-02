import { useCallback, useState } from 'react';
import { detectCityFromPosition } from '@/services/geolocationService';

interface UseGeolocationReturn {
  detectCity: () => Promise<string | null>;
  isDetecting: boolean;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [isDetecting, setIsDetecting] = useState(false);

  const detectCity = useCallback((): Promise<string | null> => {
    if (!navigator.geolocation) return Promise.resolve(null);
    setIsDetecting(true);
    return detectCurrentCity(setIsDetecting);
  }, []);

  return { detectCity, isDetecting };
};

const detectCurrentCity = (setIsDetecting: (value: boolean) => void) =>
  new Promise<string | null>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolveDetectedCity(position, setIsDetecting, resolve),
      () => resolveWithoutCity(setIsDetecting, resolve),
    );
  });

const resolveDetectedCity = async (
  position: GeolocationPosition,
  setIsDetecting: (value: boolean) => void,
  resolve: (city: string | null) => void,
) => {
  const city = await detectCityFromPosition(position);
  setIsDetecting(false);
  resolve(city);
};

const resolveWithoutCity = (
  setIsDetecting: (value: boolean) => void,
  resolve: (city: string | null) => void,
) => {
  setIsDetecting(false);
  resolve(null);
};
