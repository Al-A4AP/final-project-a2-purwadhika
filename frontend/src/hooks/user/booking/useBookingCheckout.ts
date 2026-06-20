import { useRef, useState, type MutableRefObject } from "react";
import type { NavigateFunction } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { openSnapPayment } from "@/lib/midtransSnap";
import { orderService } from "@/services/orderService";
import { userOrderActionService } from "@/services/userOrderActionService";
import type { Order, PropertyDetail, Room } from "@/types";
import { createCheckoutPayload } from "./checkoutPayload";
import { validateCheckout } from "./checkoutValidation";
import type { BookingGuestIdentity, BookingGuests, BookingQuery, PaymentMethod } from "./bookingTypes";

export const useBookingCheckout = (params: {
  agreementAccepted: boolean; query: BookingQuery; property: PropertyDetail | null; room: Room | null;
  guestIdentity: BookingGuestIdentity; guests: BookingGuests; paymentMethod: PaymentMethod; navigate: NavigateFunction;
  voucherCode: string; onOrderCreated: () => void;
}) => {
  const [processing, setProcessing] = useState(false);
  const processingRef = useRef(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const orderState = { createdOrder, setCreatedOrder, setSnapToken, snapToken };
  const setBusy = useBusySetter(processingRef, setProcessing);
  const createPendingOrder = () => reserveOrder(params, orderState, setBusy, processingRef);
  const handleCheckout = async (paymentProofFile?: File | null) => { await checkout(params, orderState, setBusy, processingRef, paymentProofFile); };
  return { processing, createdOrder, createPendingOrder, handleCheckout };
};

const useBusySetter = (
  ref: MutableRefObject<boolean>,
  setProcessing: (processing: boolean) => void,
) => (value: boolean) => {
  ref.current = value;
  setProcessing(value);
};

const checkout = async (
  params: CheckoutParams,
  state: CheckoutOrderState,
  setProcessing: BusySetter,
  processingRef: MutableRefObject<boolean>,
  paymentProofFile?: File | null,
) => {
  if (processingRef.current) return;
  if (!params.property || !params.room) return;
  if (!validateCheckout(params)) return;
  setProcessing(true);
  try { await submitCheckout(params, state, paymentProofFile); }
  catch (err) { toast.error(getApiErrorMessage(err, "Checkout gagal. Periksa tanggal, jumlah tamu, dan metode pembayaran lalu coba lagi.")); }
  finally { setProcessing(false); }
};

const reserveOrder = async (
  params: CheckoutParams,
  state: CheckoutOrderState,
  setProcessing: BusySetter,
  processingRef: MutableRefObject<boolean>,
) => {
  if (processingRef.current) return false;
  if (state.createdOrder) return true;
  if (!params.property || !params.room) return false;
  if (!validateCheckout(params)) return false;
  setProcessing(true);
  try {
    const result = await createOrder(params);
    state.setCreatedOrder(result.order);
    state.setSnapToken(result.snapToken || null);
    params.onOrderCreated();
    toast.success(getReservationMessage(result.order.total_price));
    return true;
  } catch (err) {
    toast.error(getApiErrorMessage(err, "Reservasi gagal dibuat. Selesaikan atau batalkan pesanan menunggu pembayaran sebelumnya."));
    return false;
  } finally {
    setProcessing(false);
  }
};

const submitCheckout = async (params: CheckoutParams, state: CheckoutOrderState, paymentProofFile?: File | null) => {
  const order = state.createdOrder ?? await createAndStoreOrder(params, state);
  if (order.total_price <= 0) return navigateToPaymentSuccess(params, order.id);
  if (params.paymentMethod === "MIDTRANS") return openMidtransPayment(params, order.id, state.snapToken);
  await switchToManualAndUpload(order, paymentProofFile);
  navigateToPaymentSuccess(params, order.id);
};

const createAndStoreOrder = async (params: CheckoutParams, state: CheckoutOrderState) => {
  const result = await createOrder(params);
  state.setCreatedOrder(result.order);
  state.setSnapToken(result.snapToken || null);
  params.onOrderCreated();
  return result.order;
};

const createOrder = (params: CheckoutParams) => {
  const payload = createCheckoutPayload(params.property!, params.room!, params.query, params.paymentMethod, params.guests, params.guestIdentity, params.voucherCode);
  return orderService.createOrder(payload);
};

const openMidtransPayment = async (params: CheckoutParams, orderId: string, snapToken: string | null) => {
  if (snapToken) return openSnapPayment(snapToken, params.navigate);
  const result = await userOrderActionService.retryMidtransPayment(orderId);
  if (!result.snapToken) return toast.error("Token pembayaran belum tersedia. Coba lagi dari Riwayat Reservasi.");
  openSnapPayment(result.snapToken, params.navigate);
};

const switchToManualAndUpload = async (order: Order, file?: File | null) => {
  const manualOrder = order.payment_method === "MANUAL" ? order : await userOrderActionService.switchToManualPayment(order.id);
  await uploadManualProofIfNeeded(manualOrder.id, file);
};

const uploadManualProofIfNeeded = async (orderId: string, file?: File | null) => {
  if (!file) return toast.success("Pemesanan berhasil dibuat!");
  try {
    await orderService.uploadPaymentProof(orderId, file);
    toast.success("Pesanan dan bukti pembayaran berhasil dikirim!");
  } catch {
    toast.error("Pesanan berhasil dibuat, namun bukti pembayaran gagal diunggah. Anda dapat mengunggahnya nanti dari Riwayat Pesanan.");
  }
};

const navigateToPaymentSuccess = (params: CheckoutParams, orderId?: string) =>
  params.navigate(`/payment/success?order_id=${orderId || ""}`);

const getReservationMessage = (totalPrice: number) =>
  totalPrice <= 0
    ? "Reservasi gratis berhasil dikonfirmasi."
    : "Reservasi dibuat. Selesaikan pembayaran dalam 1 jam.";

type CheckoutParams = Parameters<typeof useBookingCheckout>[0];

type CheckoutOrderState = {
  createdOrder: Order | null;
  setCreatedOrder: (order: Order) => void;
  setSnapToken: (token: string | null) => void;
  snapToken: string | null;
};

type BusySetter = (processing: boolean) => void;
