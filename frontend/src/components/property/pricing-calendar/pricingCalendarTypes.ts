import type { ButtonHTMLAttributes } from "react";
import type { Room } from "@/types";
import type { usePricingCalendar } from "@/hooks/usePricingCalendar";

export type PricingCalendarSectionProps = {
  checkIn: string;
  checkOut: string;
  dateError: string;
  rooms: Room[];
  onCheckInChange: (val: string) => void;
  onCheckOutChange: (val: string) => void;
};

export type PricingCalendarState = ReturnType<typeof usePricingCalendar>;

export type CalendarDayButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  day: { date: Date };
  modifiers?: unknown;
};
