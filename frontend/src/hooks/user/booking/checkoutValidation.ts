import { toast } from "react-hot-toast";
import { getTodayUtc, toUtcBookingDate } from "./bookingDates";
import type { useBookingCheckout } from "./useBookingCheckout";

type CheckoutParams = Parameters<typeof useBookingCheckout>[0];

export const validateCheckout = ({ agreementAccepted, guestIdentity, guests, query, room }: CheckoutParams) => {
  if (!room) return false;
  if (query.checkIn && toUtcBookingDate(query.checkIn) < getTodayUtc()) return showError("Tanggal check-in tidak boleh di masa lalu.");
  if (!guestIdentity.legalName.trim()) return showError("Nama sesuai KTP wajib diisi.");
  if (!guestIdentity.phone.trim()) return showError("Nomor telepon tamu wajib diisi.");
  if (!guestIdentity.ktpAddress.trim()) return showError("Alamat sesuai KTP wajib diisi.");
  if (!agreementAccepted) return showError("Checklist persetujuan reservasi wajib dicentang.");
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
