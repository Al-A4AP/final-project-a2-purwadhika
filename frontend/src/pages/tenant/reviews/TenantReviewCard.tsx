import type { FC } from "react";
import type { TenantReviewsState } from "@/hooks/tenant/reviews/tenantReviewsTypes";
import type { Review } from "@/types";
import { ReviewCardActions } from "./ReviewCardActions";
import { ReviewAuthor } from "./ReviewAuthor";
import { ReviewMeta } from "./ReviewMeta";
import { ReviewReplyForm } from "./ReviewReplyForm";
import { ReviewReplyList } from "./ReviewReplyList";

export const TenantReviewCard: FC<{ review: Review; state: TenantReviewsState }> = ({ review, state }) => (
  <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
    <div className="mb-5 flex flex-col justify-between gap-4 border-b border-slate-50 pb-5 sm:flex-row sm:items-start dark:border-slate-800">
      <ReviewAuthor review={review} />
      <div className="flex items-start justify-between gap-3 sm:justify-end">
        <ReviewMeta review={review} />
        <ReviewCardActions review={review} state={state} />
      </div>
    </div>
    <blockquote className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 italic">"{review.comment}"</blockquote>
    {review.replies?.length
      ? <ReviewReplyList replies={review.replies} />
      : <ReviewReplyForm reviewId={review.id} state={state} />
    }
  </article>
);
