import type { FC } from "react";
import type { Review } from "@/types";
import type { TenantReviewsState } from "./tenantReviewsTypes";
import { ReviewAuthor } from "./ReviewAuthor";
import { ReviewMeta } from "./ReviewMeta";
import { ReviewReplyForm } from "./ReviewReplyForm";
import { ReviewReplyList } from "./ReviewReplyList";

export const TenantReviewCard: FC<{ review: Review; state: TenantReviewsState }> = ({ review, state }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border dark:border-slate-700"><div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4"><ReviewAuthor review={review} /><ReviewMeta review={review} /></div><p className="text-gray-700 dark:text-gray-300 text-sm italic mb-6">"{review.comment}"</p>{review.replies?.length ? <ReviewReplyList replies={review.replies} /> : <ReviewReplyForm reviewId={review.id} state={state} />}</div>
);
