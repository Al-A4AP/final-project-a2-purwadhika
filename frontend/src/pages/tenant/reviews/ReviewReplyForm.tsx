import type { FC } from "react";
import { Send } from "lucide-react";
import type { TenantReviewsState } from "@/hooks/tenant/reviews/tenantReviewsTypes";
import { REVIEW_REPLY_MAX_LENGTH } from "@/constants/validation";

interface ReviewReplyFormProps {
  reviewId: string;
  state: TenantReviewsState;
}

export const ReviewReplyForm: FC<ReviewReplyFormProps> = ({ reviewId, state }) => (
  <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 dark:border-slate-800">
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tulis Balasan</p>
    <div className="relative">
      <ReplyTextArea reviewId={reviewId} state={state} />
      <ReplyButton reviewId={reviewId} state={state} />
    </div>
    <p className="text-right text-xs text-slate-500">
      {(state.replyText[reviewId] || "").trim().length}/{REVIEW_REPLY_MAX_LENGTH} karakter
    </p>
  </div>
);

const ReplyTextArea: FC<ReviewReplyFormProps> = ({ reviewId, state }) => (
  <textarea
    placeholder="Berikan balasan yang profesional dan personal kepada tamu Anda..."
    value={state.replyText[reviewId] || ""}
    onChange={(event) => state.handleReplyChange(reviewId, event.target.value)}
    disabled={state.submitting[reviewId]}
    maxLength={REVIEW_REPLY_MAX_LENGTH}
    className="w-full resize-y rounded-xl border border-slate-200 bg-white p-4 pr-28 text-sm text-slate-800 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-white dark:focus:ring-white min-h-24"
  />
);

const ReplyButton: FC<ReviewReplyFormProps> = ({ reviewId, state }) => (
  <button
    onClick={() => state.handleReplySubmit(reviewId)}
    disabled={state.submitting[reviewId]}
    className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
  >
    {state.submitting[reviewId] ? "Mengirim..." : <><Send size={13} /> Balas</>}
  </button>
);
