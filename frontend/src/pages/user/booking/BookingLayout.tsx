import type { FC } from "react";
import { BookingControlsColumn } from "./BookingControlsColumn";
import { BookingSummaryColumn } from "./BookingSummaryColumn";
import type { BookingPageState } from "./bookingTypes";

export const BookingLayout: FC<{ state: BookingPageState }> = ({ state }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
    <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <BookingControlsColumn state={state} />
      <BookingSummaryColumn state={state} />
    </div>
  </div>
);
