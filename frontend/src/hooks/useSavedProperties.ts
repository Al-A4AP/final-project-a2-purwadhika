import { useCallback, useState, type Dispatch, type MouseEvent, type SetStateAction } from "react";
import type { Property } from "@/types";
import { loadSavedProperties, removeSavedProperty, toggleSavedProperty } from "./savedPropertiesStorage";

export interface SavedProperty {
  id: string;
  name: string;
  featured_image_url?: string;
  category: string;
  city: string;
  rating?: number;
  min_price: number;
  saved_at: number;
}

export const useSavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>(loadSavedProperties);
  return useSavedPropertyActions(savedProperties, setSavedProperties);
};

const useSavedPropertyActions = (
  savedProperties: SavedProperty[],
  setSavedProperties: Dispatch<SetStateAction<SavedProperty[]>>,
) => {
  const isSaved = useCallback((id: string) => {
    return savedProperties.some(p => p.id === id);
  }, [savedProperties]);

  const toggleSave = useCallback((property: Property, event?: MouseEvent) => {
    stopSaveEvent(event);
    setSavedProperties((items) => toggleSavedProperty(items, property));
  }, [setSavedProperties]);

  const removeProperty = useCallback((id: string) => {
    setSavedProperties((items) => removeSavedProperty(items, id));
  }, [setSavedProperties]);

  return {
    savedProperties,
    isSaved,
    toggleSave,
    removeProperty
  };
};

const stopSaveEvent = (event?: MouseEvent) => {
  event?.preventDefault();
  event?.stopPropagation();
};
