import type { Dispatch, SetStateAction } from "react";
import type { Room } from "@/types";
import { getNextGuests } from "./guestRules";
import type { BookingGuests, GuestType } from "./bookingTypes";

export const useBookingGuests = (
  room: Room | null,
  guests: BookingGuests,
  setGuests: Dispatch<SetStateAction<BookingGuests>>,
) => {
  const updateGuest = (type: GuestType, delta: number) => {
    if (!room) return;
    setGuests((current) => getNextGuests(current, room.capacity, type, delta));
  };
  return { guests, updateGuest };
};
