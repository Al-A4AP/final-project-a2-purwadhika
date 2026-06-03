import type { FC } from "react";
import { CustomDatePickerPopup } from "@/components/common/CustomDatePickerPopup";
import { BOOKING_DATE_INPUT_CLASS } from "./dateInputClass";

interface BookingDateInputProps {
  label: string;
  min: string;
  value: string;
  onChange: (value: string) => void;
}

export const BookingDateInput: FC<BookingDateInputProps> = ({ label, min, onChange, value }) => (
  <div>
    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</label>
    <CustomDatePickerPopup min={min} value={value} onChange={onChange} className={BOOKING_DATE_INPUT_CLASS} />
  </div>
);
