import type { FC } from "react";
import type { Review } from "@/types";
import type { TenantReviewsState } from "./tenantReviewsTypes";
import { ReviewCardActions } from "./ReviewCardActions";
import { ReviewAuthor } from "./ReviewAuthor";
import { ReviewMeta } from "./ReviewMeta";
import { ReviewReplyForm } from "./ReviewReplyForm";
import { ReviewReplyList } from "./ReviewReplyList";

export const TenantReviewCard: FC<{ review: Review; state: TenantReviewsState }> = ({ review, state }) => (
  <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <ReviewAuthor review={review} />
      <div className="flex items-start justify-between gap-3 sm:justify-end">
        <ReviewMeta review={review} />
        <ReviewCardActions review={review} state={state} />
      </div>
    </div>
    <p className="mb-6 text-sm italic text-gray-700 dark:text-gray-300">"{review.comment}"</p>
    {review.replies?.length ? <ReviewReplyList replies={review.replies} /> : <ReviewReplyForm reviewId={review.id} state={state} />}
  </div>
);
