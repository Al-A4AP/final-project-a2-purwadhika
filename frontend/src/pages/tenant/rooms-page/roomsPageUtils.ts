import type { RoomFormInput } from "@/types";

export const createEmptyRoomForm = (): RoomFormInput => ({
  base_price: "",
  capacity: "",
  child_price: "",
  description: "",
  image: null,
  quantity: "1",
  room_type: "",
});

export const isWholeUnitCategory = (categoryName?: string) => ["Villa", "Rumah"].includes(categoryName || "");
