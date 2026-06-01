import type { PeakSeasonRate, RoomFormInput, RoomWithPeakRates } from "@/types";
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

export const createEditPeakForm = (rate: PeakSeasonRate): PeakRateForm => ({
  start_date: toDateInput(rate.start_date),
  end_date: toDateInput(rate.end_date),
  rate_type: rate.rate_type,
  rate_value: String(rate.rate_value),
  description: rate.description || "",
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

const toDateInput = (date: string) => date.split("T")[0] || date;
