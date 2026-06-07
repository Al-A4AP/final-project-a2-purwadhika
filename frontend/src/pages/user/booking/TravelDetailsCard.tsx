import type { FC } from "react";
import type { BookingDateFormState } from "@/hooks/user/booking/date-fields/bookingDateFieldTypes";
import { BookingDateFields } from "./date-fields/BookingDateFields";

export const TravelDetailsCard: FC<{ dateForm: BookingDateFormState }> = ({ dateForm }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border dark:border-slate-700">
    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Detail Perjalanan</h2>
    <BookingDateFields dateForm={dateForm} />
  </div>
);
