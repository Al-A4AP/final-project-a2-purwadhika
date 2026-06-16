import type { TenantProperty } from "@/types";

export const getRoomCount = (property: TenantProperty) => property._count?.rooms || 0;

export const getMinRoomPrice = (property: TenantProperty) =>
  property.rooms?.length ? Math.min(...property.rooms.map((room) => room.base_price)) : null;
