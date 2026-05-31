import { useState } from "react";
import type { Room } from "@/types";
import { getNextGuests } from "./guestRules";
import type { BookingGuests, GuestType } from "./bookingTypes";

const INITIAL_GUESTS: BookingGuests = { adults: 1, children: 0, babies: 0 };

export const useBookingGuests = (room: Room | null) => {
  const [guests, setGuests] = useState<BookingGuests>(INITIAL_GUESTS);
  const updateGuest = (type: GuestType, delta: number) => {
    if (!room) return;
    setGuests((current) => getNextGuests(current, room.capacity, type, delta));
  };
  return { guests, updateGuest };
};
