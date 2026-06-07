import { useState } from "react";
import type { NavigateFunction } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { openSnapPayment } from "@/lib/midtransSnap";
import { orderService } from "@/services/orderService";
import type { PropertyDetail, Room } from "@/types";
import { createCheckoutPayload } from "./checkoutPayload";
import { validateCheckout } from "./checkoutValidation";
import type { BookingGuestIdentity, BookingGuests, BookingQuery, PaymentMethod } from "./bookingTypes";

export const useBookingCheckout = (params: {
  agreementAccepted: boolean; query: BookingQuery; property: PropertyDetail | null; room: Room | null;
  guestIdentity: BookingGuestIdentity; guests: BookingGuests; paymentMethod: PaymentMethod; navigate: NavigateFunction;
  referralCode: string; voucherCode: string;
}) => {
  const [processing, setProcessing] = useState(false);
  const handleCheckout = async (paymentProofFile?: File | null) => { await checkout(params, setProcessing, paymentProofFile); };
  return { processing, handleCheckout };
};

const checkout = async (params: Parameters<typeof useBookingCheckout>[0], setProcessing: (processing: boolean) => void, paymentProofFile?: File | null) => {
  if (!params.property || !params.room) return;
  if (!validateCheckout(params)) return;
  setProcessing(true);
  try { await submitCheckout(params, paymentProofFile); }
  catch (err) { toast.error(getApiErrorMessage(err, "Checkout gagal. Periksa tanggal, jumlah tamu, dan metode pembayaran lalu coba lagi.")); }
  finally { setProcessing(false); }
};

const submitCheckout = async (params: Parameters<typeof useBookingCheckout>[0], paymentProofFile?: File | null) => {
  const payload = createCheckoutPayload(params.property!, params.room!, params.query, params.paymentMethod, params.guests, params.guestIdentity, params.voucherCode, params.referralCode);
  const result = await orderService.createOrder(payload);
  if (openMidtransIfNeeded(params, result.snapToken)) return;
  await uploadManualProofIfNeeded(result.order?.id, params.paymentMethod, paymentProofFile);
  navigateToPaymentSuccess(params, result.order?.id);
};

const openMidtransIfNeeded = (params: Parameters<typeof useBookingCheckout>[0], snapToken?: string | null) => {
  if (params.paymentMethod !== "MIDTRANS" || !snapToken) return false;
  openSnapPayment(snapToken, params.navigate);
  return true;
};

const uploadManualProofIfNeeded = async (orderId: string | undefined, method: PaymentMethod, file?: File | null) => {
  if (method !== "MANUAL" || !file || !orderId) return toast.success("Pemesanan berhasil dibuat!");
  try {
    await orderService.uploadPaymentProof(orderId, file);
    toast.success("Pesanan dan bukti pembayaran berhasil dikirim!");
  } catch {
    toast.error("Pesanan berhasil dibuat, namun bukti pembayaran gagal diunggah. Anda dapat mengunggahnya nanti dari Riwayat Pesanan.");
  }
};

const navigateToPaymentSuccess = (params: Parameters<typeof useBookingCheckout>[0], orderId?: string) =>
  params.navigate(`/payment/success?order_id=${orderId || ""}`);
