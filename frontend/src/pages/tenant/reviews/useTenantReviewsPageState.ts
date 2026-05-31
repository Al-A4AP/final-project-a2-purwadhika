import { useReviewReplies } from "./useReviewReplies";
import { useTenantReviews } from "./useTenantReviews";

export const useTenantReviewsPageState = () => {
  const reviewsState = useTenantReviews();
  const replyState = useReviewReplies(reviewsState.setReviews);
  return { ...reviewsState, ...replyState };
};
