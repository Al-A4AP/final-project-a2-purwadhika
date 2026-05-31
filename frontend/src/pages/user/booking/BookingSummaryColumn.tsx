import type { FC } from "react";
import { BookingSummary } from "@/components/user/BookingSummary";
import type { BookingPageState } from "./bookingTypes";

export const BookingSummaryColumn: FC<{ state: BookingPageState }> = ({ state }) => (
  <div className="md:col-span-1">
    <BookingSummary property={state.property!} room={state.room!} nights={state.totals!.nights} guests={state.guests} totalPrice={state.totals!.totalPrice} totalRoomPrice={state.totals!.totalRoomPrice} processing={state.processing} onCheckout={state.handleCheckout} />
  </div>
);
