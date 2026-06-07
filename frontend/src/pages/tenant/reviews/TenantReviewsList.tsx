import type { FC } from "react";
import type { TenantReviewsState } from "@/hooks/tenant/reviews/tenantReviewsTypes";
import { EmptyReviews } from "./EmptyReviews";
import { TenantReviewCard } from "./TenantReviewCard";

export const TenantReviewsList: FC<{ state: TenantReviewsState }> = ({ state }) => {
  if (!state.reviews.length) return <EmptyReviews />;
  return <div className="grid gap-6 xl:grid-cols-2">{state.reviews.map((review) => <TenantReviewCard key={review.id} review={review} state={state} />)}</div>;
};
