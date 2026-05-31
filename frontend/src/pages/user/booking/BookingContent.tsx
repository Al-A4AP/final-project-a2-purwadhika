import type { FC } from "react";
import { BookingLayout } from "./BookingLayout";
import type { BookingPageState } from "./bookingTypes";

export const BookingContent: FC<{ state: BookingPageState }> = ({ state }) => {
  if (state.loading || !state.property || !state.room || !state.totals) {
    return <div className="p-20 text-center">Loading...</div>;
  }
  return <BookingLayout state={state} />;
};
