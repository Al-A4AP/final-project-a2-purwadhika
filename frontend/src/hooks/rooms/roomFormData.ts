import type { RoomFormInput, RoomWithPeakRates } from "@/types";
import type { PeakRateForm } from "./roomsTypes";

export const createEmptyRoomForm = (): RoomFormInput => ({
  room_type: "",
  base_price: "",
  child_price: "",
  capacity: "",
  quantity: "1",
  description: "",
  image: null,
});

export const createEmptyPeakForm = (): PeakRateForm => ({
  start_date: "",
  end_date: "",
  rate_type: "PERCENTAGE",
  rate_value: "",
  description: "",
});

export const createEditRoomForm = (room: RoomWithPeakRates): RoomFormInput => ({
  room_type: room.room_type,
  base_price: String(room.base_price),
  child_price: room.child_price != null ? String(room.child_price) : "",
  capacity: String(room.capacity),
  quantity: String(room.quantity || 1),
  description: room.description || "",
  image: null,
});
