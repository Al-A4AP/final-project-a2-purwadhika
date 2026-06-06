import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getBookingQuery } from "./bookingQuery";
import { getBookingTotals } from "./bookingTotals";
import { useBookingDateParams } from "./date-fields/bookingDateParams";
import { useBookingCheckout } from "./useBookingCheckout";
import { useBookingData } from "./useBookingData";
import { useBookingGuests } from "./useBookingGuests";
import type { BookingPageState, PaymentMethod } from "./bookingTypes";

export const useBookingPageState = (): BookingPageState => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = useMemo(() => getBookingQuery(searchParams), [searchParams]);
  const data = useBookingData(query, navigate);
  const dateForm = useBookingDateParams(query, setSearchParams);
  const guests = useBookingGuests(data.room);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MIDTRANS");
  const checkout = useBookingCheckout({ query, ...data, ...guests, paymentMethod, navigate });
  const totals = useMemo(() => getBookingTotals(query, data.room), [query, data.room]);
  return { ...data, dateForm, ...guests, paymentMethod, setPaymentMethod, ...checkout, totals };
};
