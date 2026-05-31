import type { FC } from "react";
import { Send } from "lucide-react";
import type { TenantReviewsState } from "./tenantReviewsTypes";

interface ReviewReplyFormProps {
  reviewId: string;
  state: TenantReviewsState;
}

export const ReviewReplyForm: FC<ReviewReplyFormProps> = ({ reviewId, state }) => (
  <div className="ml-4 sm:ml-8 mt-2 relative"><textarea placeholder="Tulis balasan Anda untuk tamu ini..." value={state.replyText[reviewId] || ""} onChange={(e) => state.handleReplyChange(reviewId, e.target.value)} disabled={state.submitting[reviewId]} className="w-full text-sm border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl p-3 pr-24 focus:ring-2 focus:ring-red-500 outline-none resize-y min-h-20" /><ReplyButton reviewId={reviewId} state={state} /></div>
);

const ReplyButton: FC<ReviewReplyFormProps> = ({ reviewId, state }) => (
  <button onClick={() => state.handleReplySubmit(reviewId)} disabled={state.submitting[reviewId] || !state.replyText[reviewId]?.trim()} className="absolute right-2 bottom-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition">
    {state.submitting[reviewId] ? "Mengirim..." : <><Send size={14} /> Balas</>}
  </button>
);
