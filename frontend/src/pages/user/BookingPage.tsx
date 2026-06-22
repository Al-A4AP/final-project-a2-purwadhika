import { useEffect, useRef, type FC } from "react";
import { useSearchParams } from "react-router-dom";
import { BookingContent } from "./booking/BookingContent";
import {
  clearBookingDraft,
  getBookingDraftKey,
} from "@/hooks/user/booking/bookingDraftStorage";
import { getBookingQuery } from "@/hooks/user/booking/bookingQuery";
import { useBookingPageState } from "@/hooks/user/booking/useBookingPageState";

const BookingPage: FC = () => {
  const [searchParams] = useSearchParams();
  const draftKey = getBookingDraftKey(getBookingQuery(searchParams));
  useClearPreviousBookingDraft(draftKey);
  return <BookingPageFlow key={draftKey || "incomplete-booking-query"} />;
};

const BookingPageFlow = () => <BookingContent state={useBookingPageState()} />;

const useClearPreviousBookingDraft = (draftKey: string | null) => {
  const previousKey = useRef<string | null>(null);
  useEffect(() => {
    if (previousKey.current && previousKey.current !== draftKey) {
      clearBookingDraft(previousKey.current);
    }
    previousKey.current = draftKey;
  }, [draftKey]);
};

export default BookingPage;
