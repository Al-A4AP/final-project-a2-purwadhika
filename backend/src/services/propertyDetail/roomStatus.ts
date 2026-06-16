import { checkAvailability } from "../availabilityService";
import { calculateStayDetails } from "../pricingService";
import prisma from "../../config/prisma";
import { loadBlockedAvailabilities, loadOverlappingOrders } from "../availability/availabilityQueries";
import { getDefaultCalendarRange } from "./detailDates";
import { findRoomRelation } from "./detailQueries";
import type { RoomAvailabilityContext } from "../availability/availabilityTypes";
import type { PropertyRecord, RoomCalendarRange, RoomRecord, RoomRelation } from "./detailTypes";
import {
  buildRoomCalendarPayload,
  buildUnavailableRoomStatus,
} from "./roomCalendarPayload";

const buildPricedRoomStatus = async (
  room: RoomRecord,
  roomRel: RoomRelation | null,
  rentalType: string,
  range: RoomCalendarRange,
  checkIn: Date,
  checkOut: Date,
) => {
  const priceDetails = await calculateStayDetails(room.id, checkIn, checkOut);
  return { ...buildRoomCalendarPayload(room, roomRel, rentalType, range), is_available: true, priceDetails };
};

const buildAvailableRoomStatus = async (
  room: RoomRecord,
  roomRel: RoomRelation | null,
  rentalType: string,
  range: RoomCalendarRange,
  checkIn: Date,
  checkOut: Date,
) => {
  const avail = await checkAvailability(room.id, checkIn, checkOut);
  if (!avail.available) return buildUnavailableRoomStatus(room, roomRel, rentalType, range, avail);
  return buildPricedRoomStatus(room, roomRel, rentalType, range, checkIn, checkOut);
};

const buildRoomStatus = async (
  room: RoomRecord,
  property: PropertyRecord,
  checkIn: Date | null,
  checkOut: Date | null,
) => {
  const range = getDefaultCalendarRange();
  const roomRel: RoomRelation | null = await findRoomRelation(room.id, range);

  const roomCtx: RoomAvailabilityContext = {
    id: room.id,
    property: { id: property.id, rental_type: property.rental_type },
  };
  const stayRange = { checkIn: range.start, checkOut: range.end };
  const orders = await loadOverlappingOrders(prisma, roomCtx, stayRange);
  const availability = await loadBlockedAvailabilities(prisma, roomCtx, stayRange);
  
  if (roomRel) {
    roomRel.orders = orders;
    roomRel.availability = availability;
  }

  if (!checkIn || !checkOut) return buildRoomCalendarPayload(room, roomRel, property.rental_type, range);
  return buildAvailableRoomStatus(room, roomRel, property.rental_type, range, checkIn, checkOut);
};

export const fetchDetailedRoomsStatus = (
  property: PropertyRecord,
  checkIn: Date | null,
  checkOut: Date | null,
) => Promise.all((property.rooms || []).map((room) => buildRoomStatus(room, property, checkIn, checkOut)));
