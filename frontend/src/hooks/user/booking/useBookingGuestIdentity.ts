import { useMemo, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import type { User } from "@/types";
import type { BookingGuestIdentity } from "./bookingTypes";

export const useBookingGuestIdentity = (
  bookingForSelf: boolean,
  setBookingForSelf: (value: boolean) => void,
) => {
  const user = useAuthStore((state) => state.user);
  const [manualIdentity, setManualIdentity] = useState<BookingGuestIdentity>(buildManualIdentity);
  const identity = useMemo(() => (
    bookingForSelf ? buildUserIdentity(user) : manualIdentity
  ), [bookingForSelf, manualIdentity, user]);
  const setGuestIdentityField = buildIdentitySetter(setBookingForSelf, setManualIdentity);
  return { guestIdentity: identity, setGuestIdentityField };
};

const buildIdentitySetter = (
  setBookingForSelf: (value: boolean) => void,
  setManualIdentity: (identity: BookingGuestIdentity | IdentityUpdater) => void,
) => (field: keyof BookingGuestIdentity, value: boolean | string) => {
  if (field === "bookingForSelf") {
    return updateBookingMode(Boolean(value), setBookingForSelf, setManualIdentity);
  }
  setManualIdentity((current) => ({ ...current, [field]: value }));
};

const buildUserIdentity = (user: User | null): BookingGuestIdentity => ({
  bookingForSelf: true,
  email: user?.email || "",
  ktpAddress: user?.ktp_address || "",
  ktpNumber: user?.ktp_number || "",
  legalName: user?.legal_name || user?.name || "",
  name: user?.name || "",
  phone: user?.phone || "",
});

const buildManualIdentity = (): BookingGuestIdentity => ({
  bookingForSelf: false,
  email: "",
  ktpAddress: "",
  ktpNumber: "",
  legalName: "",
  name: "",
  phone: "",
});

const updateBookingMode = (
  value: boolean,
  setBookingForSelf: (value: boolean) => void,
  setManualIdentity: (identity: BookingGuestIdentity | IdentityUpdater) => void,
) => {
  setBookingForSelf(value);
  if (!value) setManualIdentity(buildManualIdentity());
};

type IdentityUpdater = (current: BookingGuestIdentity) => BookingGuestIdentity;
