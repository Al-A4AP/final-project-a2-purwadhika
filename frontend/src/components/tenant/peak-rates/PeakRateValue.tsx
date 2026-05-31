import type { FC } from "react";
import type { PeakSeasonRate } from "@/types";
import { formatPrice } from "@/lib/formatters";

const getRateLabel = (rate: PeakSeasonRate) =>
  rate.rate_type === "PERCENTAGE" ? `+${rate.rate_value}%` : `+${formatPrice(rate.rate_value)}`;

export const PeakRateValue: FC<{ rate: PeakSeasonRate }> = ({ rate }) => (
  <span className="font-semibold text-orange-600 dark:text-orange-400">{getRateLabel(rate)}</span>
);
