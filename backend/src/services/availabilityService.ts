import { buildNights, normalizeStayRange } from './availability/availabilityDates';
import { getAvailabilityClient, loadBlockedAvailabilities, loadOverlappingOrders, loadRoomOrThrow, type RoomWithPropertyContext } from './availability/availabilityQueries';
import { availableResult, blockedResult, fullResult } from './availability/availabilityResults';
import { findBlockedNight, findFullyBookedNight } from './availability/availabilityRules';
import type { AvailabilityClient, AvailabilityResult } from './availability/availabilityTypes';

export const checkAvailability = async (
  roomId: string,
  checkInDate: Date,
  checkOutDate: Date,
  tx?: AvailabilityClient,
): Promise<AvailabilityResult> => {
  const context = await buildAvailabilityContext(roomId, checkInDate, checkOutDate, tx);
  return resolveAvailability(context);
};

const buildAvailabilityContext = async (roomId: string, checkInDate: Date, checkOutDate: Date, tx?: AvailabilityClient) => {
  const client = getAvailabilityClient(tx);
  const room = await loadRoomOrThrow(client, roomId);
  const range = normalizeStayRange(checkInDate, checkOutDate);
  const [availabilities, orders] = await loadAvailabilityData(client, room, range);
  return { availabilities, nights: buildNights(range), orders, room };
};

const loadAvailabilityData = (client: AvailabilityClient, room: RoomWithPropertyContext, range: ReturnType<typeof normalizeStayRange>) =>
  Promise.all([
    loadBlockedAvailabilities(client, room, range),
    loadOverlappingOrders(client, room, range),
  ]);

const resolveAvailability = (context: AvailabilityContext) => {
  const blockedNight = findBlockedNight(context.nights, context.availabilities);
  if (blockedNight) return blockedResult(blockedNight);
  return resolveBookingAvailability(context);
};

const resolveBookingAvailability = (context: AvailabilityContext) => {
  const fullNight = findFullyBookedNight(context.nights, context.orders, context.room.quantity);
  return fullNight ? fullResult(fullNight) : availableResult();
};

type AvailabilityContext = Awaited<ReturnType<typeof buildAvailabilityContext>>;
