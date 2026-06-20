import type { FC } from "react";
import { useSearchParams } from "react-router-dom";
import { BookingContent } from "./booking/BookingContent";
import { getBookingDraftKey } from "@/hooks/user/booking/bookingDraftStorage";
import { getBookingQuery } from "@/hooks/user/booking/bookingQuery";
import { useBookingPageState } from "@/hooks/user/booking/useBookingPageState";

const BookingPage: FC = () => {
  const [searchParams] = useSearchParams();
  const draftKey = getBookingDraftKey(getBookingQuery(searchParams));
  return <BookingPageFlow key={draftKey || "incomplete-booking-query"} />;
};

const BookingPageFlow = () => <BookingContent state={useBookingPageState()} />;

export default BookingPage;
