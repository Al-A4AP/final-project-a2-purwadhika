import type { FC } from "react";
import { toDateInputValue } from "@/hooks/pricing-calendar/dateUtils";
import { SelectedDateField } from "./SelectedDateField";

type SelectedDateFieldsProps = {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
};

export const SelectedDateFields: FC<SelectedDateFieldsProps> = (props) => (
  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
    <SelectedDateField label="Check-in" min={getTodayInput()} value={props.checkIn} onChange={props.onCheckInChange} />
    <SelectedDateField label="Check-out" min={getCheckoutMin(props.checkIn)} value={props.checkOut} onChange={props.onCheckOutChange} />
  </div>
);

const getCheckoutMin = (checkIn: string) => checkIn ? addDaysInput(checkIn, 1) : getTodayInput();
const getTodayInput = () => toDateInputValue(new Date());
const addDaysInput = (value: string, days: number) => {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toDateInputValue(date);
};
