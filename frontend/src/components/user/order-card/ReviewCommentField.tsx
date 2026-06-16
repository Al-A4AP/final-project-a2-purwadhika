import type { FC } from "react";
import { REVIEW_COMMENT_MAX_LENGTH } from "@/constants/validation";

export const ReviewCommentField: FC<{ comment: string; setComment: (comment: string) => void }> = ({ comment, setComment }) => (
  <div className="mb-3">
    <label className="text-sm text-gray-600 dark:text-gray-300">Komentar opsional</label>
    <textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={REVIEW_COMMENT_MAX_LENGTH} className="mt-1 w-full rounded-md border p-2 dark:border-slate-600 dark:bg-slate-800" rows={3} />
    <p className="mt-1 text-xs text-slate-500">{comment.trim().length}/{REVIEW_COMMENT_MAX_LENGTH} karakter</p>
  </div>
);
