import type { RoomWithPeakRates } from "@/types";

const fallbackImage = "https://via.placeholder.com/300x200?text=Room";

export const getRoomImageUrl = (room: RoomWithPeakRates) =>
  room.images?.[0]?.image_url || fallbackImage;

export const getRoomTitle = (room: RoomWithPeakRates, isWholeUnit: boolean) =>
  isWholeUnit ? "Sewa Seluruh Properti" : room.room_type;
