import type { DateRange } from "react-day-picker";
import type { AvailabilityRangeInput } from "@/services/availabilityService";
import { getDateKey } from "./roomAvailabilityDates";

export const isAvailabilityRangeComplete = (range?: DateRange) =>
  Boolean(range?.from && range.to);

export const buildAvailabilityRangeInput = (range: DateRange, isAvailable: boolean): AvailabilityRangeInput => ({
  start_date: getDateKey(range.from as Date),
  end_date: getDateKey(range.to as Date),
  is_available: isAvailable,
});
