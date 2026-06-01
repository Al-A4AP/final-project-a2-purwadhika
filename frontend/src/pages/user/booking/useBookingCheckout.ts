import { useState } from "react";
import type { NavigateFunction } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { openSnapPayment } from "@/lib/midtransSnap";
import { orderService } from "@/services/orderService";
import type { PropertyDetail, Room } from "@/types";
import { createCheckoutPayload } from "./checkoutPayload";
import { validateCheckout } from "./checkoutValidation";
import type { BookingGuests, BookingQuery, PaymentMethod } from "./bookingTypes";

export const useBookingCheckout = (params: {
  query: BookingQuery; property: PropertyDetail | null; room: Room | null;
  guests: BookingGuests; paymentMethod: PaymentMethod; navigate: NavigateFunction;
}) => {
  const [processing, setProcessing] = useState(false);
  const handleCheckout = async () => { await checkout(params, setProcessing); };
  return { processing, handleCheckout };
};

const checkout = async (params: Parameters<typeof useBookingCheckout>[0], setProcessing: (processing: boolean) => void) => {
  if (!params.property || !params.room) return;
  if (!validateCheckout(params.query, params.room, params.guests)) return;
  setProcessing(true);
  try { await submitCheckout(params); }
  catch (err) { toast.error(getApiErrorMessage(err, "Checkout gagal. Periksa tanggal, jumlah tamu, dan metode pembayaran lalu coba lagi.")); }
  finally { setProcessing(false); }
};

const submitCheckout = async (params: Parameters<typeof useBookingCheckout>[0]) => {
  const payload = createCheckoutPayload(params.property!, params.room!, params.query, params.paymentMethod, params.guests);
  const result = await orderService.createOrder(payload);
  if (params.paymentMethod === "MIDTRANS" && result.snapToken) return openSnapPayment(result.snapToken, params.navigate);
  toast.success("Pemesanan berhasil dibuat!");
  params.navigate("/orders");
};
