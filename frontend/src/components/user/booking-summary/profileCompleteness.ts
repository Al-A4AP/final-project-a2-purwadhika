import type { BookingPageState } from "@/hooks/user/booking/bookingTypes";

export const isProfileIncomplete = (
  identity: BookingPageState["guestIdentity"],
) =>
  identity.bookingForSelf &&
  (!identity.legalName ||
    !identity.ktpNumber ||
    !identity.ktpAddress ||
    !identity.phone);
