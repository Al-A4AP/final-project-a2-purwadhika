import type { PeakRate } from './pricingTypes';
import { normalizeUtcDay } from './pricingDates';

export const getPriceForDateValue = (date: Date, basePrice: number, peakRates: PeakRate[]) => {
  const rate = findPeakRateForDate(date, peakRates);
  if (!rate) return { price: basePrice, isPeak: false };
  return { price: applyPeakRate(basePrice, rate), isPeak: true, rateName: rate.description || 'Tarif Peak Season' };
};

const findPeakRateForDate = (date: Date, peakRates: PeakRate[]) => {
  const targetDate = normalizeUtcDay(date);
  return peakRates.find((rate) => isDateInRateRange(targetDate, rate));
};
const isDateInRateRange = (targetDate: Date, rate: PeakRate) => {
  const start = normalizeUtcDay(rate.start_date);
  const end = normalizeUtcDay(rate.end_date);
  return targetDate >= start && targetDate <= end;
};
const applyPeakRate = (basePrice: number, rate: PeakRate) => {
  if (rate.rate_type === 'PERCENTAGE') return basePrice + Math.round((basePrice * rate.rate_value) / 100);
  if (rate.rate_type === 'NOMINAL') return basePrice + rate.rate_value;
  return basePrice;
};
