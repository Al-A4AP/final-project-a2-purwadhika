import type { Room } from '@prisma/client';
import type { PeakRateFormData, RoomFormData } from './tenantRoomTypes';

export const buildRoomCreateData = (propertyId: string, data: RoomFormData, image: { url: string; public_id: string }) => ({
  propertyId,
  room_type: data.room_type,
  base_price: Number(data.base_price),
  child_price: data.child_price ? Number(data.child_price) : null,
  capacity: Number(data.capacity),
  quantity: data.quantity ? Number(data.quantity) : 1,
  description: data.description || null,
  images: { create: { image_url: image.url, cloudinary_public_id: image.public_id, order: 0 } },
});

export const buildRoomUpdateData = (data: RoomFormData, room: Room) => ({
  room_type: data.room_type ?? room.room_type,
  base_price: data.base_price ? Number(data.base_price) : room.base_price,
  child_price: normalizeChildPrice(data.child_price, room.child_price),
  capacity: data.capacity ? Number(data.capacity) : room.capacity,
  quantity: data.quantity ? Number(data.quantity) : room.quantity,
  description: data.description ?? room.description,
});

export const buildPeakRateData = (roomId: string, data: PeakRateFormData) => ({
  roomId,
  rate_type: data.rate_type,
  start_date: new Date(data.start_date),
  end_date: new Date(data.end_date),
  rate_value: Number(data.rate_value),
  description: data.description || null,
});

export const normalizeAvailabilityDate = (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);
  return startOfDay;
};

const normalizeChildPrice = (value: RoomFormData['child_price'], fallback: number | null) => {
  if (value === '') return null;
  return value ? Number(value) : fallback;
};
