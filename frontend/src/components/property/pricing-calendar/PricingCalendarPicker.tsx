import type { FC } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { CALENDAR_DAY_STYLES, CALENDAR_MODIFIER_CLASSES } from "./calendarStyles";
import { PricingDayButton } from "./PricingDayButton";
import type { PricingCalendarState } from "./pricingCalendarTypes";

const getMonthCount = () => (window.innerWidth > 768 ? 2 : 1);

export const PricingCalendarPicker: FC<{ calendar: PricingCalendarState }> = ({ calendar }) => (
  <div className="flex justify-center overflow-x-auto bg-gray-50 dark:bg-slate-900/50 p-6 rounded-xl border border-gray-100 dark:border-slate-700/50">
    <DayPicker mode="range" selected={calendar.selectedRange} onSelect={calendar.handleSelect} disabled={{ before: calendar.today }} numberOfMonths={getMonthCount()} pagedNavigation components={{ DayButton: (props) => <PricingDayButton {...props} calendar={calendar} /> }} modifiersClassNames={CALENDAR_MODIFIER_CLASSES} styles={CALENDAR_DAY_STYLES} />
  </div>
);
