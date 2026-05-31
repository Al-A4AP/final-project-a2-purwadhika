import type { FC, ReactNode } from "react";
import { ErrorState } from "@/components/common/ErrorState";
import { Pagination } from "@/components/common/Pagination";
import { ReviewsHeader } from "./ReviewsHeader";
import { ReviewsSkeleton } from "./ReviewsSkeleton";
import { TenantReviewsList } from "./TenantReviewsList";
import type { TenantReviewsState } from "./tenantReviewsTypes";

export const TenantReviewsContent: FC<{ state: TenantReviewsState }> = ({ state }) => {
  if (state.loading && state.reviews.length === 0) return <ReviewsSkeleton />;
  if (state.error) return <ReviewsPageShell><ReviewsHeader /><ErrorState title="Ulasan belum bisa dimuat" message={state.error} onRetry={() => state.handlePageChange(state.pagination.page || 1)} /></ReviewsPageShell>;
  return <ReviewsPageShell><ReviewsHeader /><TenantReviewsList state={state} />{state.reviews.length > 0 && <Pagination currentPage={state.pagination.page || 1} totalPages={state.pagination.totalPages || 1} totalItems={state.pagination.total || 0} onPageChange={state.handlePageChange} />}</ReviewsPageShell>;
};

const ReviewsPageShell: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="p-6 md:p-8 space-y-6 max-w-5xl">{children}</div>
);
