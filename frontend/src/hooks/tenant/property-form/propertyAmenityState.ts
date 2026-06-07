import { useState } from "react";

export const useAmenityState = () => {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const toggleAmenity = (uid: string) => setSelectedAmenities((items) => toggleValue(items, uid));
  return { selectedAmenities, setSelectedAmenities, toggleAmenity };
};

const toggleValue = (items: string[], uid: string) => {
  if (items.includes(uid)) return items.filter((item) => item !== uid);
  return [...items, uid];
};

export type AmenityState = ReturnType<typeof useAmenityState>;

