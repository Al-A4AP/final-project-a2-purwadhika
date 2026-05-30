import { useState } from 'react';
import { detectCityFromPosition } from '@/services/geolocationService';

interface UseGeolocationReturn {
  detectCity: () => Promise<string | null>;
  isDetecting: boolean;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [isDetecting, setIsDetecting] = useState(false);

  const detectCity = (): Promise<string | null> => {
    if (!navigator.geolocation) return Promise.resolve(null);
    setIsDetecting(true);
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const city = await detectCityFromPosition(pos);
          setIsDetecting(false);
          resolve(city);
        },
        () => { setIsDetecting(false); resolve(null); }
      );
    });
  };

  return { detectCity, isDetecting };
};
