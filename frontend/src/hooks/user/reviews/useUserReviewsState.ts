import { useCallback, useEffect, useMemo, useState } from "react";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types";
import { useReviewSubmission } from "../orders/useReviewSubmission";

export const useUserReviewsState = () => {
  const { error, fetchOrders, loading, orders } = useReviewOrders();
  const reviewActions = useReviewSubmission(orders, fetchOrders);
  const summary = useReviewSummary(orders);
  return { error, loading, ...summary, ...reviewActions };
};

const useReviewOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchOrders = useCallback(async () => {
    await loadReviewOrders({ setError, setLoading, setOrders });
  }, []);
  useInitialReviewFetch(fetchOrders);
  return { error, fetchOrders, loading, orders };
};

const useInitialReviewFetch = (fetchOrders: () => Promise<void>) => {
  useEffect(() => {
    Promise.resolve().then(() => fetchOrders());
  }, [fetchOrders]);
};

const useReviewSummary = (orders: Order[]) => {
  const eligibleOrders = useMemo(() => getEligibleReviewOrders(orders), [orders]);
  const submittedReviews = useMemo(() => getSubmittedReviewOrders(orders), [orders]);
  const averageRating = useMemo(() => getAverageRating(submittedReviews), [submittedReviews]);
  return { averageRating, eligibleOrders, submittedReviews, totalReviews: submittedReviews.length };
};

const loadReviewOrders = async (actions: ReviewOrderActions) => {
  actions.setLoading(true);
  try {
    const data = await orderService.getUserOrders({ limit: 100 });
    actions.setOrders(data.orders);
  } catch {
    actions.setError("Gagal memuat ulasan. Silakan coba lagi.");
  } finally {
    actions.setLoading(false);
  }
};

const getEligibleReviewOrders = (orders: Order[]) =>
  orders.filter((order) => order.status === "COMPLETED" && !order.review);

const getSubmittedReviewOrders = (orders: Order[]) =>
  orders.filter((order) => !!order.review);

const getAverageRating = (orders: Order[]) => {
  if (orders.length === 0) return 0;
  const total = orders.reduce((sum, order) => sum + (order.review?.rating || 0), 0);
  return total / orders.length;
};

interface ReviewOrderActions {
  setError: (value: string | null) => void;
  setLoading: (value: boolean) => void;
  setOrders: (value: Order[]) => void;
}
