import { useCallback } from "react";
import { useCancelOrder } from "./useCancelOrder";
import { useMidtransOrderActions } from "./useMidtransOrderActions";
import { usePaymentProofUpload } from "./usePaymentProofUpload";
import { useReviewSubmission } from "./useReviewSubmission";
import { useUserOrders } from "./useUserOrders";

export const useUserOrdersPageState = () => {
  const ordersState = useUserOrders();
  const { fetchOrders, orders } = ordersState;
  const refetch = useCallback(() => fetchOrders(), [fetchOrders]);
  const cancel = useCancelOrder(orders, refetch);
  const midtrans = useMidtransOrderActions(refetch);
  const upload = usePaymentProofUpload(orders, refetch);
  const review = useReviewSubmission(orders, refetch);
  const { fileInputRef, ...uploadState } = upload;
  return { fileInputRef, state: { ...ordersState, ...cancel, ...midtrans, ...uploadState, ...review } };
};
