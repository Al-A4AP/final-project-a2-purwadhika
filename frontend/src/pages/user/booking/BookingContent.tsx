import type { FC } from "react";
import { SectionLoading } from "@/components/common/SectionLoading";
import { BookingLayout } from "./BookingLayout";
import type { BookingPageState } from "@/hooks/user/booking/bookingTypes";

export const BookingContent: FC<{ state: BookingPageState }> = ({ state }) => {
  if (state.loading || !state.property || !state.room || !state.totals) {
    return <SectionLoading className="mx-auto max-w-7xl border-0 px-4 py-12 shadow-none dark:bg-slate-900" label="Menyiapkan detail booking..." size="lg" variant="booking" />;
  }
  return <BookingLayout state={state} />;
};
