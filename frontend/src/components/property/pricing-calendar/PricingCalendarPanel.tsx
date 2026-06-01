import type { FC } from "react";
import { DateErrorNotice } from "./DateErrorNotice";
import { NightsNotice } from "./NightsNotice";
import { PricingCalendarHeader } from "./PricingCalendarHeader";
import { PricingCalendarLegend } from "./PricingCalendarLegend";
import { PricingCalendarPicker } from "./PricingCalendarPicker";
import { SelectedDateFields } from "./SelectedDateFields";
import type { PricingCalendarSectionProps, PricingCalendarState } from "./pricingCalendarTypes";

type PricingCalendarPanelProps = { props: PricingCalendarSectionProps; calendar: PricingCalendarState };

export const PricingCalendarPanel: FC<PricingCalendarPanelProps> = ({ props, calendar }) => (
  <div id="date-picker-section" className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border dark:border-slate-700 mb-8">
    <PricingCalendarHeader selectedRoom={props.selectedRoom} />
    <PricingCalendarLegend />
    <PricingCalendarPicker calendar={calendar} />
    <SelectedDateFields checkIn={props.checkIn} checkOut={props.checkOut} onCheckInChange={props.onCheckInChange} onCheckOutChange={props.onCheckOutChange} />
    <DateErrorNotice message={props.dateError} />
    <NightsNotice nights={calendar.nights} />
  </div>
);
