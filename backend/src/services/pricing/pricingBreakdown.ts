import { getPriceForDateValue } from './pricingRules';
import type { RoomWithPeakRates, StayDetailBreakdown } from './pricingTypes';

export const buildBreakdown = (ci: Date, co: Date, room: RoomWithPeakRates) => {
  const breakdown: StayDetailBreakdown[] = [];
  let totalPrice = 0;
  for (const date of iterateStayDates(ci, co)) {
    const result = getPriceForDateValue(date, room.base_price, room.peakRates);
    breakdown.push({ date: date.toISOString().split('T')[0], ...result });
    totalPrice += result.price;
  }
  return { breakdown, totalPrice };
};

function* iterateStayDates(ci: Date, co: Date) {
  const current = new Date(ci);
  while (current < co) {
    yield new Date(current);
    current.setDate(current.getDate() + 1);
  }
}
