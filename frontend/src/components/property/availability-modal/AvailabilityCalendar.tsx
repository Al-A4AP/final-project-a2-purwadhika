import type { FC } from "react";
import { usePricingCalendar } from "@/hooks/usePricingCalendar";
import type { Room } from "@/types";
import { DateErrorNotice } from "../pricing-calendar/DateErrorNotice";
import { NightsNotice } from "../pricing-calendar/NightsNotice";
import { PricingCalendarLegend } from "../pricing-calendar/PricingCalendarLegend";
import { PricingCalendarPicker } from "../pricing-calendar/PricingCalendarPicker";
import { SelectedDateFields } from "../pricing-calendar/SelectedDateFields";

interface AvailabilityCalendarProps {
  checkIn: string;
  checkOut: string;
  dateError: string;
  room: Room;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
}

export const AvailabilityCalendar: FC<AvailabilityCalendarProps> = (props) => {
  const calendar = usePricingCalendar(props.room, props.checkIn, props.checkOut, props.onCheckInChange, props.onCheckOutChange);
  return (
    <div id="availability-date-picker-section" className="space-y-4">
      <PricingCalendarLegend />
      <PricingCalendarPicker calendar={calendar} />
      <SelectedDateFields checkIn={props.checkIn} checkOut={props.checkOut} onCheckInChange={props.onCheckInChange} onCheckOutChange={props.onCheckOutChange} />
      <DateErrorNotice message={props.dateError} />
      <NightsNotice nights={calendar.nights} />
    </div>
  );
};
