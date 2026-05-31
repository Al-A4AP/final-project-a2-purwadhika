import type { FC } from "react";
import { Pagination } from "@/components/common/Pagination";
import { ReviewsHeader } from "./ReviewsHeader";
import { ReviewsSkeleton } from "./ReviewsSkeleton";
import { TenantReviewsList } from "./TenantReviewsList";
import type { TenantReviewsState } from "./tenantReviewsTypes";

export const TenantReviewsContent: FC<{ state: TenantReviewsState }> = ({ state }) => {
  if (state.loading && state.reviews.length === 0) return <ReviewsSkeleton />;
  return <div className="p-6 md:p-8 space-y-6 max-w-5xl"><ReviewsHeader /><TenantReviewsList state={state} /><Pagination currentPage={state.pagination.page || 1} totalPages={state.pagination.totalPages || 1} totalItems={state.pagination.total || 0} onPageChange={state.handlePageChange} /></div>;
};
