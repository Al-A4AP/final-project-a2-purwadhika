import type { TenantPropertyDetail } from "@/types";
import type { PropertyFormInput } from "./propertyFormSchema";

export const toPropertyFormValues = (property: TenantPropertyDetail): PropertyFormInput => ({
  name: property.name,
  description: property.description,
  categoryId: property.categoryId,
  rental_type: property.rental_type || "PER_ROOM",
  whole_property_price: wholePropertyValue(property, "base_price"),
  whole_property_capacity: wholePropertyValue(property, "capacity"),
  address: property.address,
  city: property.city,
  province: property.province || "",
  amenities: property.amenities?.join(",") || "",
  latitude: property.latitude?.toString() || "",
  longitude: property.longitude?.toString() || "",
});

const wholePropertyValue = (
  property: TenantPropertyDetail,
  field: "base_price" | "capacity",
) => property.rental_type === "WHOLE_PROPERTY"
  ? String(property.rooms[0]?.[field] || "")
  : "";

export const buildPropertyFormData = (data: PropertyFormInput, amenities: string[], file: File | null) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => appendPropertyValue(formData, key, value));
  formData.append("amenities", amenities.join(","));
  if (file) formData.append("featured_image", file);
  return formData;
};

const appendPropertyValue = (formData: FormData, key: string, value?: string) => {
  if (key === "description") return formData.append(key, value || "");
  if (key !== "amenities" && value) formData.append(key, value);
};
