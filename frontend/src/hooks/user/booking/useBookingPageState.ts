import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getBookingQuery } from "./bookingQuery";
import { getBookingTotals } from "./bookingTotals";
import { useBookingDateParams } from "./date-fields/bookingDateParams";
import { useBookingCheckout } from "./useBookingCheckout";
import { useBookingData } from "./useBookingData";
import { useBookingDraft } from "./useBookingDraft";
import { useBookingGuestIdentity } from "./useBookingGuestIdentity";
import { useBookingGuests } from "./useBookingGuests";
import { useBookingVoucher } from "./useBookingVoucher";
import type { BookingPageState } from "./bookingTypes";

export const useBookingPageState = (): BookingPageState => {
  const route = useBookingRouteState();
  const form = useBookingFormState(route);
  const checkout = useBookingCheckout(buildCheckoutParams(route, form));
  return buildBookingPageState(route, form, checkout);
};

const useBookingRouteState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = useMemo(() => getBookingQuery(searchParams), [searchParams]);
  const data = useBookingData(query, navigate);
  const dateForm = useBookingDateParams(query, setSearchParams);
  return { data, dateForm, navigate, query };
};

const useBookingFormState = (route: BookingRouteState) => {
  const draft = useBookingDraft(route.query);
  const guests = useBookingGuests(route.data.room, draft.draft, draft.setGuests);
  const identity = useBookingGuestIdentity(draft.draft.bookingForSelf, draft.setBookingForSelf);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const totals = useMemo(() => getBookingTotals(route.query, route.data.room), [route.query, route.data.room]);
  const voucher = useBookingVoucher(route.query, totals, draft.draft.voucherCode, draft.setVoucherCode);
  return { agreementAccepted, draft, guests, identity, setAgreementAccepted, totals, voucher };
};

const buildCheckoutParams = (route: BookingRouteState, form: BookingFormState) => ({
  agreementAccepted: form.agreementAccepted,
  query: route.query,
  ...route.data,
  ...form.identity,
  ...form.guests,
  ...form.voucher,
  paymentMethod: form.draft.draft.paymentMethod,
  navigate: route.navigate,
  onOrderCreated: form.draft.clearDraft,
});

const buildBookingPageState = (
  route: BookingRouteState,
  form: BookingFormState,
  checkout: ReturnType<typeof useBookingCheckout>,
): BookingPageState => ({
  ...route.data,
  ...buildBookingFormPageState(route, form),
  ...checkout,
  totals: form.totals,
});

const buildBookingFormPageState = (route: BookingRouteState, form: BookingFormState) => ({
  agreementAccepted: form.agreementAccepted,
  dateForm: route.dateForm,
  ...form.identity,
  ...form.guests,
  ...form.voucher,
  currentStep: form.draft.draft.currentStep,
  paymentMethod: form.draft.draft.paymentMethod,
  setAgreementAccepted: form.setAgreementAccepted,
  setCurrentStep: form.draft.setCurrentStep,
  setPaymentMethod: form.draft.setPaymentMethod,
});

type BookingRouteState = ReturnType<typeof useBookingRouteState>;
type BookingFormState = ReturnType<typeof useBookingFormState>;
