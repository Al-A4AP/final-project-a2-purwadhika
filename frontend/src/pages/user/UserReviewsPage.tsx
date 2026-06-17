import type { FC } from "react";
import { useUserReviewsState } from "@/hooks/user/reviews/useUserReviewsState";
import {
  PendingReviewsList,
  ReviewsEmptyState,
  ReviewsErrorPanel,
  ReviewsHeader,
  ReviewsLoading,
  ReviewsPagination,
  ReviewsTabs,
  SubmittedReviewsList,
} from "./reviews/UserReviewsPageParts";

const UserReviewsPage: FC = () => {
  const state = useUserReviewsState();
  const hasAnyData = state.orders.length > 0;

  if (state.error) return <ReviewsErrorPanel error={state.error} />;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 pb-24 dark:bg-slate-900 md:p-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <ReviewsHeader />
        <ReviewsTabs activeTab={state.activeTab} setActiveTab={state.setActiveTab} />
        {state.loading ? <ReviewsLoading /> : <ReviewsContent state={state} hasAnyData={hasAnyData} />}
      </div>
    </div>
  );
};

const ReviewsContent: FC<{
  state: ReturnType<typeof useUserReviewsState>;
  hasAnyData: boolean;
}> = ({ state, hasAnyData }) => (
  <>
    {state.activeTab === "pending" && hasAnyData && <PendingReviewsList orders={state.orders} state={state} />}
    {state.activeTab === "submitted" && hasAnyData && <SubmittedReviewsList orders={state.orders} />}
    {!hasAnyData && <ReviewsEmptyState activeTab={state.activeTab} />}
    {hasAnyData && state.pagination && (state.pagination.totalPages || 1) > 1 && (
      <ReviewsPagination pagination={state.pagination} handlePageChange={state.handlePageChange} />
    )}
  </>
);

export default UserReviewsPage;
