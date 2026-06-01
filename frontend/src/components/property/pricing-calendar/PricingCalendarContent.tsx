import type { FC } from "react";
import { usePricingCalendar } from "@/hooks/usePricingCalendar";
import { PricingCalendarPanel } from "./PricingCalendarPanel";
import type { PricingCalendarSectionProps } from "./pricingCalendarTypes";

export const PricingCalendarContent: FC<PricingCalendarSectionProps> = (props) => {
  const calendar = usePricingCalendar(
    props.selectedRoom,
    props.checkIn,
    props.checkOut,
    props.onCheckInChange,
    props.onCheckOutChange,
  );
  return <PricingCalendarPanel props={props} calendar={calendar} />;
};
