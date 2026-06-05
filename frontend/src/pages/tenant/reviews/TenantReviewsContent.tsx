import type { FC, ReactNode } from "react";
import { ErrorState } from "@/components/common/ErrorState";
import { Pagination } from "@/components/common/Pagination";
import { ReviewsHeader } from "./ReviewsHeader";
import { ReviewsSkeleton } from "./ReviewsSkeleton";
import { TenantReviewDeleteModal } from "./TenantReviewDeleteModal";
import { TenantReviewRatingSummary } from "./TenantReviewRatingSummary";
import { TenantReviewsList } from "./TenantReviewsList";
import type { TenantReviewsState } from "./tenantReviewsTypes";

export const TenantReviewsContent: FC<{ state: TenantReviewsState }> = ({ state }) => {
  if (state.loading && state.reviews.length === 0) return <ReviewsSkeleton />;
  if (state.error) return (
    <ReviewsPageShell>
      <ReviewsHeader />
      <ErrorState title="Ulasan belum bisa dimuat" message={state.error} onRetry={() => state.handlePageChange(state.pagination.page || 1)} />
    </ReviewsPageShell>
  );
  return (
    <ReviewsPageShell>
      <ReviewsHeader />
      <TenantReviewRatingSummary summary={state.summary} />
      <TenantReviewsList state={state} />
      {state.reviews.length > 0 && (
        <div className="rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <Pagination currentPage={state.pagination.page || 1} totalPages={state.pagination.totalPages || 1} totalItems={state.pagination.total || 0} onPageChange={state.handlePageChange} />
        </div>
      )}
      <TenantReviewDeleteModal state={state} />
    </ReviewsPageShell>
  );
};

const ReviewsPageShell: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-10 dark:bg-slate-900 pb-24">
    <div className="mx-auto max-w-5xl space-y-8">{children}</div>
  </div>
);
