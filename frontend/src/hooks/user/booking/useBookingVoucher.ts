import { useState } from "react";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { voucherService } from "@/services/voucherService";
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
    setPreview(await voucherService.previewVoucher({ propertyId: query.propertyId, subtotal: totals.totalPrice, voucher_code: code, total_nights: totals.nights }));
    toast.success("Voucher diterapkan");
  } catch (err) {
    setPreview(null);
    toast.error(getApiErrorMessage(err, "Voucher tidak valid atau sudah tidak aktif."));
  } finally { setLoading(false); }
};

type SetBoolean = (value: boolean) => void;
type SetPreview = (preview: VoucherPreview | null) => void;
