import type { FC } from "react";
import type { DatePrice } from "@/hooks/pricing-calendar/pricingCalendarTypes";

type PricingDayPriceProps = {
  isPast: boolean;
  pricing: DatePrice | null;
};

export const PricingDayPrice: FC<PricingDayPriceProps> = ({ isPast, pricing }) => {
  if (isPast) return null;
  if (!pricing) return <span className="text-[9px] mt-0.5 text-gray-400 z-10">Pilih</span>;
  if (pricing.status === "CUSTOMER_BOOKED") return <StatusText label="Terisi" tone="text-red-700 dark:text-red-300" />;
  if (pricing.status === "TENANT_BLOCKED") return <StatusText label="Off" tone="text-amber-700 dark:text-amber-300" />;
  if (pricing.price === null) return <StatusText label="Penuh" tone="text-gray-500 dark:text-gray-400" />;
  const tone = pricing.isPeak ? "text-red-600 dark:text-red-400 font-bold" : "text-gray-500 dark:text-gray-400";
  return <span className={`text-[9px] mt-0.5 whitespace-nowrap z-10 ${tone}`}>{formatPrice(pricing.price)}</span>;
};

const formatPrice = (price: number) => (price >= 1000 ? `${price / 1000}k` : price);

const StatusText: FC<{ label: string; tone: string }> = ({ label, tone }) => (
  <span className={`z-10 mt-0.5 text-[9px] font-semibold ${tone}`}>{label}</span>
);
