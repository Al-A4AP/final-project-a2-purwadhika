import { useState } from "react";
import type { NavigateFunction } from "react-router-dom";
import type { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { orderService } from "@/services/orderService";
import type { ApiResponse, PropertyDetail, Room } from "@/types";
import { createCheckoutPayload } from "./checkoutPayload";
import { validateCheckout } from "./checkoutValidation";
import { openSnapPayment } from "./snapPayment";
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
  catch (err) { toast.error(getCheckoutError(err)); }
  finally { setProcessing(false); }
};

const submitCheckout = async (params: Parameters<typeof useBookingCheckout>[0]) => {
  const payload = createCheckoutPayload(params.property!, params.room!, params.query, params.paymentMethod, params.guests);
  const result = await orderService.createOrder(payload);
  if (params.paymentMethod === "MIDTRANS" && result.snapToken) return openSnapPayment(result.snapToken, params.navigate);
  toast.success("Pemesanan berhasil dibuat!");
  params.navigate("/orders");
};

const getCheckoutError = (err: unknown) => {
  const axiosError = err as AxiosError<ApiResponse<null>>;
  return axiosError.response?.data?.message || "Checkout gagal";
};
