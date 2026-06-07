import { useMemo, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import type { User } from "@/types";
import type { BookingGuestIdentity } from "./bookingTypes";

export const useBookingGuestIdentity = () => {
  const user = useAuthStore((state) => state.user);
  const [bookingForSelf, setBookingForSelf] = useState(true);
  const [manualIdentity, setManualIdentity] = useState<BookingGuestIdentity>(() => buildManualIdentity(user));
  const identity = useMemo(() => (
    bookingForSelf ? buildUserIdentity(user) : manualIdentity
  ), [bookingForSelf, manualIdentity, user]);

  const setGuestIdentityField = (field: keyof BookingGuestIdentity, value: boolean | string) => {
    if (field === "bookingForSelf") return updateBookingMode(Boolean(value), user, setBookingForSelf, setManualIdentity);
    setManualIdentity((current) => ({ ...current, [field]: value }));
  };

  return { guestIdentity: identity, setGuestIdentityField };
};

const buildUserIdentity = (user: User | null): BookingGuestIdentity => ({
  bookingForSelf: true,
  domicileAddress: user?.domicile_address || "",
  email: user?.email || "",
  ktpAddress: user?.ktp_address || "",
  legalName: user?.legal_name || user?.name || "",
  name: user?.name || "",
  phone: user?.phone || "",
});

const buildManualIdentity = (user: User | null): BookingGuestIdentity => ({
  ...buildUserIdentity(user),
  bookingForSelf: false,
});

const updateBookingMode = (
  value: boolean,
  user: User | null,
  setBookingForSelf: (value: boolean) => void,
  setManualIdentity: (identity: BookingGuestIdentity) => void,
) => {
  setBookingForSelf(value);
  if (!value) setManualIdentity(buildManualIdentity(user));
};
