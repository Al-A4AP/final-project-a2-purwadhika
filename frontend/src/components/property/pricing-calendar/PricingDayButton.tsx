import type { FC } from "react";
import { PricingDayPrice } from "./PricingDayPrice";
import type { CalendarDayButtonProps, PricingCalendarState } from "./pricingCalendarTypes";

type PricingDayButtonProps = CalendarDayButtonProps & { calendar: PricingCalendarState };

export const PricingDayButton: FC<PricingDayButtonProps> = ({ calendar, day, ...buttonProps }) => {
  const date = day.date;
  const isPast = date < calendar.today;
  const pricing = isPast ? null : calendar.getPriceForDate(date);
  return <button {...buttonProps} className={`${buttonProps.className || ""} flex flex-col items-center justify-center h-full w-full py-1 relative`}><span className="text-sm font-medium z-10">{date.getDate()}</span><PricingDayPrice isPast={isPast} pricing={pricing} /></button>;
};
