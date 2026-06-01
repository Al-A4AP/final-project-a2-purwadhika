import { useCallback } from "react";
import { useCancelManualOrder } from "./useCancelManualOrder";
import { usePaymentProofUpload } from "./usePaymentProofUpload";
import { useReviewSubmission } from "./useReviewSubmission";
import { useUserOrders } from "./useUserOrders";

export const useUserOrdersPageState = () => {
  const ordersState = useUserOrders();
  const { fetchOrders, orders } = ordersState;
  const refetch = useCallback(() => fetchOrders(), [fetchOrders]);
  const cancel = useCancelManualOrder(orders, refetch);
  const upload = usePaymentProofUpload(orders, refetch);
  const review = useReviewSubmission(orders, refetch);
  const { fileInputRef, ...uploadState } = upload;
  return { fileInputRef, state: { ...ordersState, ...cancel, ...uploadState, ...review } };
};
