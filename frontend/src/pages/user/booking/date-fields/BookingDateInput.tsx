import type { FC } from "react";
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
    <input type="date" min={min} value={value} onChange={(event) => onChange(event.target.value)} className={BOOKING_DATE_INPUT_CLASS} />
  </div>
);
