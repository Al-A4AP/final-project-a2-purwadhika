import { RentalType, type Prisma } from "@prisma/client";
import {
  buildNights,
  normalizeStayRange,
} from "../availability/availabilityDates";

type RoomLockContext = {
  id: string;
  property: { id: string; rental_type: RentalType };
};

export const lockStayRange = async (
  tx: Prisma.TransactionClient,
  room: RoomLockContext,
  checkIn: Date,
  checkOut: Date,
) => {
  const keys = buildLockKeys(room, checkIn, checkOut);
  for (const key of keys) await lockKey(tx, key);
};

const buildLockKeys = (
  room: RoomLockContext,
  checkIn: Date,
  checkOut: Date,
) => {
  const range = normalizeStayRange(checkIn, checkOut);
  const scope =
    room.property.rental_type === RentalType.WHOLE_PROPERTY
      ? `property:${room.property.id}`
      : `room:${room.id}`;
  return buildNights(range)
    .map((night) => `${scope}:${night.toISOString()}`)
    .sort();
};
const lockKey = (tx: Prisma.TransactionClient, key: string) =>
  tx.$executeRaw`
    SELECT pg_advisory_xact_lock(hashtextextended(${key}, 0))
  `;
