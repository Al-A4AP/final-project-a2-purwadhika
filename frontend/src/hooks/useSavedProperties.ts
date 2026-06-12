import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from "react";
import type { Property } from "@/types";
import {
  loadSavedProperties,
  removeSavedProperty,
  toggleSavedProperty,
} from "./savedPropertiesStorage";

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

let savedPropertiesStore: SavedProperty[] = loadSavedProperties();
const savedPropertiesListeners = new Set<
  Dispatch<SetStateAction<SavedProperty[]>>
>();

const notifySavedProperties = (properties: SavedProperty[]) => {
  savedPropertiesListeners.forEach((listener) => listener(properties));
};

const subscribeSavedProperties = (
  listener: Dispatch<SetStateAction<SavedProperty[]>>,
) => {
  savedPropertiesListeners.add(listener);
  return () => {
    savedPropertiesListeners.delete(listener);
  };
};

export const useSavedProperties = () => {
  const [savedProperties, setSavedProperties] =
    useState<SavedProperty[]>(savedPropertiesStore);

  useEffect(() => subscribeSavedProperties(setSavedProperties), []);

  return useSavedPropertyActions(savedProperties, setSavedProperties);
};

const useSavedPropertyActions = (
  savedProperties: SavedProperty[],
  setSavedProperties: Dispatch<SetStateAction<SavedProperty[]>>,
) => {
  const isSaved = useCallback(
    (id: string) => {
      return savedProperties.some((p) => p.id === id);
    },
    [savedProperties],
  );

  const toggleSave = useCallback(
    (property: Property, event?: MouseEvent) => {
      stopSaveEvent(event);
      setSavedProperties((items) => {
        const next = toggleSavedProperty(items, property);
        savedPropertiesStore = next;
        notifySavedProperties(next);
        return next;
      });
    },
    [setSavedProperties],
  );

  const removeProperty = useCallback(
    (id: string) => {
      setSavedProperties((items) => {
        const next = removeSavedProperty(items, id);
        savedPropertiesStore = next;
        notifySavedProperties(next);
        return next;
      });
    },
    [setSavedProperties],
  );

  return {
    savedProperties,
    isSaved,
    toggleSave,
    removeProperty,
  };
};

const stopSaveEvent = (event?: MouseEvent) => {
  event?.preventDefault();
  event?.stopPropagation();
};
