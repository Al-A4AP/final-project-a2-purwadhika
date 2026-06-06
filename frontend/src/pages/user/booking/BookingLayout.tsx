import type { FC } from "react";
import { ReservationStepper } from "./ReservationStepper";
import type { BookingPageState } from "@/hooks/user/booking/bookingTypes";

export const BookingLayout: FC<{ state: BookingPageState }> = ({ state }) => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-16">
    <ReservationStepper state={state} />
  </div>
);
