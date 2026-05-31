import { useCallback } from "react";
import { usePaymentProofUpload } from "./usePaymentProofUpload";
import { useReviewSubmission } from "./useReviewSubmission";
import { useUserOrders } from "./useUserOrders";

export const useUserOrdersPageState = () => {
  const ordersState = useUserOrders();
  const { fetchOrders, orders } = ordersState;
  const refetch = useCallback(() => fetchOrders(), [fetchOrders]);
  const upload = usePaymentProofUpload(orders, refetch);
  const review = useReviewSubmission(orders, refetch);
  const { fileInputRef, ...uploadState } = upload;
  return { fileInputRef, state: { ...ordersState, ...uploadState, ...review } };
};
