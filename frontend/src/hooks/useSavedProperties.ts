import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from "react";
import type { Property } from "@/types";
import { useAuthStore } from "@/stores/authStore";
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
  const hydrated = useAuthStore((state) => state.hydrated);
  const isUser = useAuthStore((state) => state.user?.role === "USER");
  const [savedProperties, setSavedProperties] =
    useState<SavedProperty[]>(savedPropertiesStore);

  useEffect(() => subscribeSavedProperties(setSavedProperties), []);

  return useSavedPropertyActions(savedProperties, setSavedProperties, hydrated && isUser);
};

const useSavedPropertyActions = (
  savedProperties: SavedProperty[],
  setSavedProperties: Dispatch<SetStateAction<SavedProperty[]>>,
  canManageSavedProperties: boolean,
) => {
  const isSaved = useCallback(
    (id: string) =>
      canManageSavedProperties && savedProperties.some((property) => property.id === id),
    [canManageSavedProperties, savedProperties],
  );

  const toggleSave = useCallback(
    (property: Property, event?: MouseEvent) => {
      stopSaveEvent(event);
      if (!canManageSavedProperties) return;
      setSavedProperties((items) => {
        const next = toggleSavedProperty(items, property);
        savedPropertiesStore = next;
        notifySavedProperties(next);
        return next;
      });
    },
    [canManageSavedProperties, setSavedProperties],
  );

  const removeProperty = useCallback(
    (id: string) => {
      if (!canManageSavedProperties) return;
      setSavedProperties((items) => {
        const next = removeSavedProperty(items, id);
        savedPropertiesStore = next;
        notifySavedProperties(next);
        return next;
      });
    },
    [canManageSavedProperties, setSavedProperties],
  );

  return {
    savedProperties: canManageSavedProperties ? savedProperties : [],
    isSaved,
    toggleSave,
    removeProperty,
  };
};

const stopSaveEvent = (event?: MouseEvent) => {
  event?.preventDefault();
  event?.stopPropagation();
};
