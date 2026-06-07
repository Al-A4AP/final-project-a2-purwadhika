import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getBookingQuery } from "./bookingQuery";
import { getBookingTotals } from "./bookingTotals";
import { useBookingDateParams } from "./date-fields/bookingDateParams";
import { useBookingCheckout } from "./useBookingCheckout";
import { useBookingData } from "./useBookingData";
import { useBookingGuestIdentity } from "./useBookingGuestIdentity";
import { useBookingGuests } from "./useBookingGuests";
import { useBookingReferral } from "./useBookingReferral";
import { useBookingVoucher } from "./useBookingVoucher";
import type { BookingPageState, PaymentMethod } from "./bookingTypes";

export const useBookingPageState = (): BookingPageState => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = useMemo(() => getBookingQuery(searchParams), [searchParams]);
  const data = useBookingData(query, navigate);
  const dateForm = useBookingDateParams(query, setSearchParams);
  const guests = useBookingGuests(data.room);
  const guestIdentity = useBookingGuestIdentity();
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MIDTRANS");
  const totals = useMemo(() => getBookingTotals(query, data.room), [query, data.room]);
  const referral = useBookingReferral();
  const voucher = useBookingVoucher(query, totals);
  const checkout = useBookingCheckout({ agreementAccepted, query, ...data, ...guestIdentity, ...guests, ...referral, ...voucher, paymentMethod, navigate });
  return { ...data, agreementAccepted, dateForm, ...guestIdentity, ...guests, ...referral, ...voucher, paymentMethod, setAgreementAccepted, setPaymentMethod, ...checkout, totals };
};
