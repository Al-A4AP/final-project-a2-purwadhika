import type { FC } from "react";
import type { DatePrice } from "@/hooks/pricing-calendar/pricingCalendarTypes";

type PricingDayPriceProps = {
  isPast: boolean;
  pricing: DatePrice | null;
};

export const PricingDayPrice: FC<PricingDayPriceProps> = ({ isPast, pricing }) => {
  if (isPast) return null;
  if (!pricing) return <span className="text-[9px] mt-0.5 text-gray-400 z-10">Penuh</span>;
  const tone = pricing.isPeak ? "text-red-600 dark:text-red-400 font-bold" : "text-gray-500 dark:text-gray-400";
  return <span className={`text-[9px] mt-0.5 whitespace-nowrap z-10 ${tone}`}>{formatPrice(pricing.price)}</span>;
};

const formatPrice = (price: number) => (price >= 1000 ? `${price / 1000}k` : price);
