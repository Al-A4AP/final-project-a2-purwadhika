import type { FC } from "react";
import { EmptyReviews } from "./EmptyReviews";
import { TenantReviewCard } from "./TenantReviewCard";
import type { TenantReviewsState } from "./tenantReviewsTypes";

export const TenantReviewsList: FC<{ state: TenantReviewsState }> = ({ state }) => {
  if (!state.reviews.length) return <EmptyReviews />;
  return <div className="space-y-6">{state.reviews.map((review) => <TenantReviewCard key={review.id} review={review} state={state} />)}</div>;
};
