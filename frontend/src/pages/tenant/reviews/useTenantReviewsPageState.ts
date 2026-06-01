import { useCallback } from "react";
import { useReviewDelete } from "./useReviewDelete";
import { useReviewReplies } from "./useReviewReplies";
import { useTenantReviews } from "./useTenantReviews";

export const useTenantReviewsPageState = () => {
  const reviewsState = useTenantReviews();
  const replyState = useReviewReplies(reviewsState.setReviews);
  const { fetchReviews, pagination, setReviews } = reviewsState;
  const reloadCurrentPage = useCallback(
    () => fetchReviews(pagination.page || 1),
    [fetchReviews, pagination.page],
  );
  const deleteState = useReviewDelete(setReviews, reloadCurrentPage);
  return { ...reviewsState, ...replyState, ...deleteState };
};
