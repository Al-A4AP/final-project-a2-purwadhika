import { useState } from "react";
import { toast } from "react-hot-toast";
import { reviewService } from "@/services/reviewService";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { canReviewOrder } from "@/lib/orderStatus";
import type { Order } from "@/types";

export const useReviewSubmission = (orders: Order[], refetch: () => void) => {
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const handleReviewSubmit = useReviewSubmitHandler({ comment, orders, rating, refetch, reviewOrderId, setComment, setRating, setReviewOrderId, setSubmittingReview });
  return { comment, handleReviewSubmit, rating, reviewOrderId, setComment, setRating, setReviewOrderId, submittingReview };
};

interface ReviewSubmitOptions {
  comment: string;
  orders: Order[];
  rating: number;
  refetch: () => void;
  reviewOrderId: string | null;
  setComment: (value: string) => void;
  setRating: (value: number) => void;
  setReviewOrderId: (value: string | null) => void;
  setSubmittingReview: (value: boolean) => void;
}

const useReviewSubmitHandler = (options: ReviewSubmitOptions) => async (event: React.FormEvent) => {
  event.preventDefault();
  const order = options.orders.find((item) => item.id === options.reviewOrderId);
  if (!order || !canSubmitReview(order)) return;
  await submitReview(options);
};

const canSubmitReview = (order: Order) => {
  if (!canReviewOrder(order)) { toast.error("Ulasan hanya dapat diberikan setelah checkout selesai."); return false; }
  if (order.review) { toast.error("Anda sudah memberikan ulasan untuk pesanan ini."); return false; }
  return true;
};

const submitReview = async (options: ReviewSubmitOptions) => {
  options.setSubmittingReview(true);
  try { await reviewService.createReview(options.reviewOrderId!, options.rating, options.comment); onReviewSuccess(options); }
  catch (err) { toast.error(getApiErrorMessage(err, "Ulasan gagal dikirim. Periksa rating dan komentar lalu coba lagi.")); }
  finally { options.setSubmittingReview(false); }
};

const onReviewSuccess = (options: ReviewSubmitOptions) => {
  toast.success("Review berhasil dikirim!");
  options.setReviewOrderId(null);
  options.setComment("");
  options.setRating(5);
  options.refetch();
};
