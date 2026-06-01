import type { FC } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface AvailabilityCalendarProps {
  blockedDays: Date[];
  range?: DateRange;
  onRangeChange: (range?: DateRange) => void;
}

export const AvailabilityCalendar: FC<AvailabilityCalendarProps> = (props) => (
  <div className="flex justify-center rounded-lg bg-gray-50 p-4 dark:bg-slate-900">
    <DayPicker mode="range" selected={props.range} onSelect={props.onRangeChange} disabled={[{ before: new Date() }]} modifiers={{ blocked: props.blockedDays }} modifiersStyles={{ blocked: { backgroundColor: "#ef4444", color: "white" } }} />
  </div>
);
