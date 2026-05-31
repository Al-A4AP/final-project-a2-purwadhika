import type { PeakSeasonRate } from "@/types";
import { formatPrice } from "@/lib/formatters";

export const formatPeakRateDate = (date: string) => new Date(date).toLocaleDateString("id-ID");

export const formatPeakRateValue = (rate: PeakSeasonRate) =>
  rate.rate_type === "PERCENTAGE" ? `+${rate.rate_value}%` : `+${formatPrice(rate.rate_value)}`;
