import toast from "react-hot-toast";
import type { Property } from "@/types";
import type { SavedProperty } from "./useSavedProperties";

const STORAGE_KEY = "purwaloka_saved_properties";
const MAX_SAVED_PROPERTIES = 50;

export const loadSavedProperties = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseSavedProperties(stored) : [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

export const removeSavedProperty = (items: SavedProperty[], id: string) => {
  const next = items.filter((property) => property.id !== id);
  persistSavedProperties(next);
  showSavedToast(id, "Properti dihapus.");
  return next;
};

export const toggleSavedProperty = (items: SavedProperty[], property: Property) =>
  isPropertySaved(items, property.id) ? removeFromSaved(items, property.id) : addToSaved(items, property);

const addToSaved = (items: SavedProperty[], property: Property) => {
  const next = [toSavedProperty(property), ...items];
  persistSavedProperties(next);
  showSavedToast(property.id, "Tersimpan! Lihat di Properti Tersimpan Anda.");
  return next;
};

const removeFromSaved = (items: SavedProperty[], id: string) => {
  const next = items.filter((property) => property.id !== id);
  persistSavedProperties(next);
  showSavedToast(id, "Dihapus dari properti tersimpan.");
  return next;
};

const showSavedToast = (id: string, message: string) =>
  toast.success(message, { id: `saved-property-${id}` });

const persistSavedProperties = (items: SavedProperty[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_SAVED_PROPERTIES)));

const isPropertySaved = (items: SavedProperty[], id: string) =>
  items.some((property) => property.id === id);

const parseSavedProperties = (stored: string) => {
  const parsed: unknown = JSON.parse(stored);
  return Array.isArray(parsed) ? parsed.filter(isSavedProperty).slice(0, MAX_SAVED_PROPERTIES) : [];
};

const isSavedProperty = (value: unknown): value is SavedProperty =>
  isRecord(value) && typeof value.id === "string";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toSavedProperty = (property: Property): SavedProperty => ({
  id: property.id,
  name: property.name,
  featured_image_url: property.featured_image_url,
  category: property.category?.name || "Akomodasi",
  city: property.city,
  rating: property.rating,
  min_price: property.min_price,
  saved_at: Date.now(),
});
