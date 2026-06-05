import { AMENITIES_LIST } from "@/lib/amenities";
import { formatCurrency } from "@/lib/formatters";
import type { TenantProperty } from "@/types";

export const minPropertyPrice = (property: TenantProperty) => {
  const prices = property.rooms?.map((room) => room.base_price) || [];
  return prices.length ? Math.min(...prices) : null;
};

export const propertyPriceLabel = (property: TenantProperty) => {
  const price = minPropertyPrice(property);
  return price === null ? "Belum ada kamar" : `Mulai ${formatCurrency(price)}`;
};

export const amenityLabel = (id: string) =>
  AMENITIES_LIST.find((item) => item.id === id)?.label || id;
