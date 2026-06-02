import { buildRoomCalendarAvailability } from "../propertyDetailCalendar";
import type {
  AvailabilityReason,
  RoomCalendarRange,
  RoomRecord,
  RoomRelation,
} from "./detailTypes";

const getRoomCalendarAvailability = (
  room: RoomRecord,
  roomRel: RoomRelation | null,
  range: RoomCalendarRange,
) =>
  buildRoomCalendarAvailability(
    room,
    roomRel?.availability || [],
    roomRel?.orders || [],
    range,
  );

export const buildRoomCalendarPayload = (
  room: RoomRecord,
  roomRel: RoomRelation | null,
  range: RoomCalendarRange,
) => {
  const availability = getRoomCalendarAvailability(room, roomRel, range);
  return {
    ...room,
    images: roomRel?.images,
    peakRates: roomRel?.peakRates,
    availability,
    availabilities: availability,
  };
};

export const buildUnavailableRoomStatus = (
  room: RoomRecord,
  roomRel: RoomRelation | null,
  range: RoomCalendarRange,
  avail: AvailabilityReason,
) => ({
  ...buildRoomCalendarPayload(room, roomRel, range),
  availability_source: avail.source,
  is_available: false,
  reason: avail.reason || "Kamar tidak tersedia pada tanggal yang dipilih.",
});
