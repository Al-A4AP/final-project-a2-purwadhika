import type { PeakSeasonRate } from "@/types";
import type { PeakRateForm } from "./roomsTypes";

export const hasPeakRateConflict = (rates: PeakSeasonRate[], form: PeakRateForm, editingId?: string | null) => {
  if (!form.start_date || !form.end_date) return false;
  const range = { start: new Date(form.start_date), end: new Date(form.end_date) };
  return rates.some((rate) => rate.id !== editingId && isOverlapping(range, rate));
};

const isOverlapping = (range: { start: Date; end: Date }, rate: PeakSeasonRate) =>
  range.start <= new Date(rate.end_date) && range.end >= new Date(rate.start_date);
