import type { FC } from "react";
import { BookingContent } from "./booking/BookingContent";
import { useBookingPageState } from "./booking/useBookingPageState";

const BookingPage: FC = () => <BookingContent state={useBookingPageState()} />;

export default BookingPage;
