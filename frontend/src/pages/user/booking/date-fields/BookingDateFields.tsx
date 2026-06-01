import type { FC } from "react";
import { BookingDateInput } from "./BookingDateInput";
import type { BookingDateFormState } from "./bookingDateFieldTypes";

export const BookingDateFields: FC<{ dateForm: BookingDateFormState }> = ({ dateForm }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <BookingDateInput label="Check-in" min={dateForm.today} value={dateForm.checkIn} onChange={dateForm.setCheckIn} />
    <BookingDateInput label="Check-out" min={dateForm.checkoutMinDate} value={dateForm.checkOut} onChange={dateForm.setCheckOut} />
  </div>
);
