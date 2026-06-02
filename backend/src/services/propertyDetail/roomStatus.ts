import { checkAvailability } from "../availabilityService";
import { calculateStayDetails } from "../pricingService";
import { getDefaultCalendarRange } from "./detailDates";
import { findRoomRelation } from "./detailQueries";
import type { RoomCalendarRange, RoomRecord, RoomRelation } from "./detailTypes";
import {
  buildRoomCalendarPayload,
  buildUnavailableRoomStatus,
} from "./roomCalendarPayload";

const buildPricedRoomStatus = async (
  room: RoomRecord,
  roomRel: RoomRelation | null,
  range: RoomCalendarRange,
  checkIn: Date,
  checkOut: Date,
) => {
  const priceDetails = await calculateStayDetails(room.id, checkIn, checkOut);
  return { ...buildRoomCalendarPayload(room, roomRel, range), is_available: true, priceDetails };
};

const buildAvailableRoomStatus = async (
  room: RoomRecord,
  roomRel: RoomRelation | null,
  range: RoomCalendarRange,
  checkIn: Date,
  checkOut: Date,
) => {
  const avail = await checkAvailability(room.id, checkIn, checkOut);
  if (!avail.available) return buildUnavailableRoomStatus(room, roomRel, range, avail);
  return buildPricedRoomStatus(room, roomRel, range, checkIn, checkOut);
};

const buildRoomStatus = async (
  room: RoomRecord,
  checkIn: Date | null,
  checkOut: Date | null,
) => {
  const range = getDefaultCalendarRange();
  const roomRel = await findRoomRelation(room.id, range);
  if (!checkIn || !checkOut) return buildRoomCalendarPayload(room, roomRel, range);
  return buildAvailableRoomStatus(room, roomRel, range, checkIn, checkOut);
};

export const fetchDetailedRoomsStatus = (
  rooms: RoomRecord[],
  checkIn: Date | null,
  checkOut: Date | null,
) => Promise.all(rooms.map((room) => buildRoomStatus(room, checkIn, checkOut)));
