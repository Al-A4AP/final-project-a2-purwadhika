import type { FC } from "react";
import { PricingDayPrice } from "./PricingDayPrice";
import type { DatePrice } from "@/hooks/pricing-calendar/pricingCalendarTypes";
import type { CalendarDayButtonProps, PricingCalendarState } from "./pricingCalendarTypes";

type PricingDayButtonProps = CalendarDayButtonProps & { calendar: PricingCalendarState };

export const PricingDayButton: FC<PricingDayButtonProps> = ({ calendar, day, ...buttonProps }) => {
  const date = day.date;
  const isPast = date < calendar.today;
  const pricing = isPast ? null : calendar.getPriceForDate(date);
  return <button {...buttonProps} className={dayButtonClass(buttonProps.className, pricing)}><span className="text-sm font-medium z-10">{date.getDate()}</span><PricingDayPrice isPast={isPast} pricing={pricing} /></button>;
};

const dayButtonClass = (className: string | undefined, pricing: DatePrice | null) =>
  `${className || ""} flex h-full w-full flex-col items-center justify-center py-1 relative ${statusClass(pricing)}`;

const statusClass = (pricing: DatePrice | null) => {
  if (pricing?.status === "CUSTOMER_BOOKED") return "rounded-md bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (pricing?.status === "TENANT_BLOCKED") return "rounded-md bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "";
};
