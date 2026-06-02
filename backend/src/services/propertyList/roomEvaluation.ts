import { checkAvailability } from "../availabilityService";
import { calculateStayDetails } from "../pricingService";
import type { Room, RoomEvaluationResult } from "./listTypes";

const createRoomEvaluationResult = (): RoomEvaluationResult => ({
  hasAvailable: false,
  minPrice: Infinity,
  roomsWithStatus: [],
});

const addRoomWithoutDate = (room: Room, data: RoomEvaluationResult) => {
  data.roomsWithStatus.push(room);
};

const addAvailableRoom = async (
  room: Room,
  checkIn: Date,
  checkOut: Date,
  data: RoomEvaluationResult,
) => {
  const priceDetails = await calculateStayDetails(room.id, checkIn, checkOut);
  data.hasAvailable = true;
  data.minPrice = Math.min(data.minPrice, priceDetails.totalPrice);
  data.roomsWithStatus.push({ ...room, is_available: true, priceDetails });
};

const evaluateDatedRoom = async (
  room: Room,
  checkIn: Date,
  checkOut: Date,
  data: RoomEvaluationResult,
) => {
  const avail = await checkAvailability(room.id, checkIn, checkOut);
  if (avail.available) await addAvailableRoom(room, checkIn, checkOut, data);
};

const evaluateRoom = async (
  room: Room,
  checkIn: Date | null,
  checkOut: Date | null,
  data: RoomEvaluationResult,
) => {
  if (!checkIn || !checkOut) return addRoomWithoutDate(room, data);
  try {
    await evaluateDatedRoom(room, checkIn, checkOut, data);
  } catch {
    return;
  }
};

export const evaluateRooms = async (
  rooms: Room[],
  checkIn: Date | null,
  checkOut: Date | null,
) => {
  const data = createRoomEvaluationResult();
  for (const room of rooms) await evaluateRoom(room, checkIn, checkOut, data);
  return data;
};
