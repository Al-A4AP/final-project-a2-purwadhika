import type { ButtonHTMLAttributes } from "react";
import type { usePricingCalendar } from "@/hooks/usePricingCalendar";

export type PricingCalendarState = ReturnType<typeof usePricingCalendar>;

export type CalendarDayButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  day: { date: Date };
  modifiers?: unknown;
};
