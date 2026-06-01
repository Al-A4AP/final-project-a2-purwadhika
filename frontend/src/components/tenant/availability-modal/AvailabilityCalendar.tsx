import type { FC } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface AvailabilityCalendarProps {
  customerBookedDays: Date[];
  range?: DateRange;
  tenantBlockedDays: Date[];
  onRangeChange: (range?: DateRange) => void;
}

export const AvailabilityCalendar: FC<AvailabilityCalendarProps> = (props) => (
  <div className="flex justify-center rounded-lg bg-gray-50 p-4 dark:bg-slate-900">
    <DayPicker mode="range" selected={props.range} onSelect={props.onRangeChange} disabled={[{ before: new Date() }, ...props.customerBookedDays]} modifiers={availabilityModifiers(props)} modifiersStyles={availabilityStyles} />
  </div>
);

const availabilityModifiers = (props: AvailabilityCalendarProps) => ({
  customerBooked: props.customerBookedDays,
  tenantBlocked: props.tenantBlockedDays,
});

const availabilityStyles = {
  customerBooked: { backgroundColor: "#dc2626", color: "white" },
  tenantBlocked: { backgroundColor: "#f59e0b", color: "white" },
};
