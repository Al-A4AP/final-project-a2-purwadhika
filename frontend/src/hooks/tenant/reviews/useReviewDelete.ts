import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { tenantService } from "@/services/tenantService";
import type { Review } from "@/types";

export const useReviewDelete = (
  setReviews: Dispatch<SetStateAction<Review[]>>,
  reloadReviews: () => Promise<void>,
) => {
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const closeDeleteReview = useCallback(() => setDeleteTarget(null), []);
  const openDeleteReview = useCallback((review: Review) => setDeleteTarget(review), []);
  const confirmDeleteReview = useConfirmDelete(deleteTarget, setDeleteTarget, setDeletingReviewId, setReviews, reloadReviews);
  return { closeDeleteReview, confirmDeleteReview, deleteTarget, deletingReviewId, openDeleteReview };
};

const useConfirmDelete = (
  review: Review | null,
  setDeleteTarget: Dispatch<SetStateAction<Review | null>>,
  setDeletingReviewId: Dispatch<SetStateAction<string | null>>,
  setReviews: Dispatch<SetStateAction<Review[]>>,
  reloadReviews: () => Promise<void>,
) => useCallback(async () => {
  if (!review) return;
  setDeletingReviewId(review.id);
  try { await deleteReview(review.id, setReviews, reloadReviews); setDeleteTarget(null); }
  catch (err) { toast.error(getApiErrorMessage(err, "Ulasan gagal dihapus. Coba lagi.")); }
  finally { setDeletingReviewId(null); }
}, [reloadReviews, review, setDeleteTarget, setDeletingReviewId, setReviews]);

const deleteReview = async (
  reviewId: string,
  setReviews: Dispatch<SetStateAction<Review[]>>,
  reloadReviews: () => Promise<void>,
) => {
  await tenantService.deleteReview(reviewId);
  toast.success("Ulasan berhasil dihapus");
  setReviews((prev) => prev.filter((item) => item.id !== reviewId));
  void reloadReviews();
};
