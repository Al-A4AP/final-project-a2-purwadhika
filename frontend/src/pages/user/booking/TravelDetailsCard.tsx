import type { FC } from "react";
import { BookingDateFields } from "./date-fields/BookingDateFields";
import type { BookingDateFormState } from "./date-fields/bookingDateFieldTypes";

export const TravelDetailsCard: FC<{ dateForm: BookingDateFormState }> = ({ dateForm }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border dark:border-slate-700">
    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Detail Perjalanan</h2>
    <BookingDateFields dateForm={dateForm} />
  </div>
);
