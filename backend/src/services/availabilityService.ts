import { buildNights, normalizeStayRange } from './availability/availabilityDates';
import { getAvailabilityClient, loadBlockedAvailabilities, loadOverlappingOrders, loadRoomOrThrow } from './availability/availabilityQueries';
import { availableResult, blockedResult, fullResult } from './availability/availabilityResults';
import { findBlockedNight, findFullyBookedNight } from './availability/availabilityRules';
import type { AvailabilityClient, AvailabilityResult } from './availability/availabilityTypes';

export const checkAvailability = async (
  roomId: string,
  checkInDate: Date,
  checkOutDate: Date,
  tx?: AvailabilityClient,
): Promise<AvailabilityResult> => {
  const client = getAvailabilityClient(tx);
  const room = await loadRoomOrThrow(client, roomId);
  const range = normalizeStayRange(checkInDate, checkOutDate);
  const nights = buildNights(range);
  const [availabilities, orders] = await Promise.all([
    loadBlockedAvailabilities(client, roomId, range),
    loadOverlappingOrders(client, roomId, range),
  ]);
  const blockedNight = findBlockedNight(nights, availabilities);
  if (blockedNight) return blockedResult(blockedNight);
  const fullNight = findFullyBookedNight(nights, orders, room.quantity);
  return fullNight ? fullResult(fullNight) : availableResult();
};
