import type { FC } from "react";
import { useState } from "react";
import { toDateInputValue } from "@/hooks/pricing-calendar/dateUtils";
import { SelectedDateField } from "./SelectedDateField";

type OpenDateField = "checkIn" | "checkOut" | null;

type SelectedDateFieldsProps = {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
};

export const SelectedDateFields: FC<SelectedDateFieldsProps> = (props) => {
  const [openField, setOpenField] = useState<OpenDateField>(null);
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <SelectedDateField {...checkInFieldProps(props, openField, setOpenField)} />
      <SelectedDateField {...checkOutFieldProps(props, openField, setOpenField)} />
    </div>
  );
};

const checkInFieldProps = (
  props: SelectedDateFieldsProps,
  openField: OpenDateField,
  setOpenField: (field: OpenDateField) => void,
) => ({
  label: "Check-in",
  min: getTodayInput(),
  onChange: props.onCheckInChange,
  onOpenChange: (open: boolean) => setOpenField(open ? "checkIn" : null),
  open: openField === "checkIn",
  value: props.checkIn,
});

const checkOutFieldProps = (
  props: SelectedDateFieldsProps,
  openField: OpenDateField,
  setOpenField: (field: OpenDateField) => void,
) => ({
  label: "Check-out",
  min: getCheckoutMin(props.checkIn),
  onChange: props.onCheckOutChange,
  onOpenChange: (open: boolean) => setOpenField(open ? "checkOut" : null),
  open: openField === "checkOut",
  value: props.checkOut,
});

const getCheckoutMin = (checkIn: string) => checkIn ? addDaysInput(checkIn, 1) : getTodayInput();
const getTodayInput = () => toDateInputValue(new Date());
const addDaysInput = (value: string, days: number) => {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toDateInputValue(date);
};
