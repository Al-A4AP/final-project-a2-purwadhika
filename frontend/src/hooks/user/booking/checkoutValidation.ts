import { toast } from "react-hot-toast";
import { getTodayUtc, toUtcBookingDate } from "./bookingDates";
import type { useBookingCheckout } from "./useBookingCheckout";
import { MAX_ADULT_CAPACITY, PHONE_REGEX } from "@/constants/validation";

type CheckoutParams = Parameters<typeof useBookingCheckout>[0];

export const validateCheckout = ({ agreementAccepted, guestIdentity, guests, query, room }: CheckoutParams) => {
  if (!room) return false;
  if (query.checkIn && toUtcBookingDate(query.checkIn) < getTodayUtc()) return showError("Tanggal check-in tidak boleh di masa lalu.");
  if (!guestIdentity.legalName.trim()) return showError("Nama sesuai KTP wajib diisi.");
  if (!guestIdentity.ktpNumber.trim() || !/^\d{16}$/.test(guestIdentity.ktpNumber.trim())) return showError("Nomor KTP harus terdiri dari 16 digit angka.");
  if (!guestIdentity.phone.trim()) return showError("Nomor telepon tamu wajib diisi.");
  if (!PHONE_REGEX.test(guestIdentity.phone.trim())) return showError("Format nomor telepon tidak valid.");
  if (!guestIdentity.ktpAddress.trim()) return showError("Alamat sesuai KTP wajib diisi.");
  if (!agreementAccepted) return showError("Checklist persetujuan reservasi wajib dicentang.");
  return validateGuestCounts(guests, room.capacity);
};

const validateGuestCounts = (guests: CheckoutParams["guests"], roomCapacity: number) => {
  if (guests.adults < 1) return showError("Pemesanan harus menyertakan minimal 1 orang dewasa.");
  if (guests.adults > MAX_ADULT_CAPACITY) return showError(`Jumlah orang dewasa maksimal ${MAX_ADULT_CAPACITY} orang.`);
  if (guests.adults > roomCapacity) return showError(`Jumlah orang dewasa tidak boleh melebihi kapasitas kamar (${roomCapacity} orang).`);
  if (guests.children > guests.adults) return showError("Jumlah anak-anak tidak boleh melebihi jumlah orang dewasa.");
  if (guests.babies > guests.adults) return showError("Jumlah bayi tidak boleh melebihi jumlah orang dewasa.");
  return true;
};

const showError = (message: string) => {
  toast.error(message);
  return false;
};
