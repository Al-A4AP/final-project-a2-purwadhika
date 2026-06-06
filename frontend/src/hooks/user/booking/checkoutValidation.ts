import { toast } from "react-hot-toast";
import type { Room } from "@/types";
import { getTodayUtc, toUtcBookingDate } from "./bookingDates";
import type { BookingGuests, BookingQuery } from "./bookingTypes";

export const validateCheckout = (query: BookingQuery, room: Room, guests: BookingGuests) => {
  if (query.checkIn && toUtcBookingDate(query.checkIn) < getTodayUtc()) return showError("Tanggal check-in tidak boleh di masa lalu.");
  if (guests.adults < 1) return showError("Pemesanan harus menyertakan minimal 1 orang dewasa.");
  if (guests.adults > room.capacity) return showError(`Jumlah orang dewasa tidak boleh melebihi kapasitas kamar (${room.capacity} orang).`);
  if (guests.children > guests.adults) return showError("Jumlah anak-anak tidak boleh melebihi jumlah orang dewasa.");
  if (guests.babies > guests.adults) return showError("Jumlah bayi tidak boleh melebihi jumlah orang dewasa.");
  return true;
};

const showError = (message: string) => {
  toast.error(message);
  return false;
};
