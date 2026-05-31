import { checkAvailability } from './availabilityService';
import { buildBreakdown } from './pricing/pricingBreakdown';
import { buildStayRange, countNights } from './pricing/pricingDates';
import { findRoomWithPeakRates } from './pricing/pricingQueries';
import { getPriceForDateValue } from './pricing/pricingRules';
import type { PeakRate, PricingClient, StayDetailBreakdown } from './pricing/pricingTypes';

export type { StayDetailBreakdown } from './pricing/pricingTypes';

export const getPriceForDate = (date: Date, basePrice: number, peakRates: PeakRate[]) =>
  getPriceForDateValue(date, basePrice, peakRates);

export const calculateStayDetails = async (roomId: string, checkInDate: Date, checkOutDate: Date, tx?: PricingClient) => {
  const room = await findRoomWithPeakRates(roomId, tx);
  if (!room) throw new Error('Kamar tidak ditemukan');
  const { ci, co } = buildStayRange(checkInDate, checkOutDate);
  const { breakdown, totalPrice } = buildBreakdown(ci, co, room);
  return buildStayDetails(roomId, room.base_price, ci, co, totalPrice, breakdown);
};

export const getValidatedStayDetails = async (roomId: string, checkInDate: Date, checkOutDate: Date, tx?: PricingClient) => {
  const availability = await checkAvailability(roomId, checkInDate, checkOutDate, tx);
  if (!availability.available) throw new Error(availability.reason || 'Kamar penuh');
  return calculateStayDetails(roomId, checkInDate, checkOutDate, tx);
};

const buildStayDetails = (
  roomId: string,
  basePrice: number,
  ci: Date,
  co: Date,
  totalPrice: number,
  breakdown: StayDetailBreakdown[],
) => ({ roomId, basePrice, nights: countNights(ci, co), totalPrice, breakdown });
