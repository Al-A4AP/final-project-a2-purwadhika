import { useState } from "react";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { voucherService } from "@/services/voucherService";
import { toUtcDateTime } from "./bookingDates";
import type { BookingQuery, BookingTotals } from "./bookingTypes";
import type { VoucherPreview } from "@/types";

export const useBookingVoucher = (query: BookingQuery, totals: BookingTotals | null) => {
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherPreview, setVoucherPreview] = useState<VoucherPreview | null>(null);
  const applyVoucher = () => previewVoucher(query, totals, voucherCode, setVoucherLoading, setVoucherPreview);
  const clearVoucher = () => { setVoucherCode(""); setVoucherPreview(null); };
  return { applyVoucher, clearVoucher, setVoucherCode, voucherCode, voucherLoading, voucherPreview };
};

const previewVoucher = async (query: BookingQuery, totals: BookingTotals | null, code: string, setLoading: SetBoolean, setPreview: SetPreview) => {
  if (!query.propertyId || !totals || !code.trim()) {
    toast.error("Masukkan kode voucher terlebih dahulu.");
    return;
  }
  setLoading(true);
  try {
    setPreview(await voucherService.previewVoucher(buildPreviewPayload(query, totals, code)));
    toast.success("Voucher diterapkan");
  } catch (err) {
    setPreview(null);
    toast.error(getApiErrorMessage(err, "Voucher tidak valid atau sudah tidak aktif."));
  } finally { setLoading(false); }
};

const buildPreviewPayload = (query: BookingQuery, totals: BookingTotals, code: string) => ({
  check_in_date: query.checkIn ? toUtcDateTime(query.checkIn) : undefined,
  check_out_date: query.checkOut ? toUtcDateTime(query.checkOut) : undefined,
  propertyId: query.propertyId!,
  roomId: query.roomId || undefined,
  subtotal: totals.totalPrice,
  total_nights: totals.nights,
  voucher_code: code,
});

type SetBoolean = (value: boolean) => void;
type SetPreview = (preview: VoucherPreview | null) => void;
