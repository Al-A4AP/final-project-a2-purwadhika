import type { FC } from "react";

export const ReviewCommentField: FC<{ comment: string; setComment: (comment: string) => void }> = ({ comment, setComment }) => (
  <div className="mb-3">
    <label className="text-sm text-gray-600 dark:text-gray-300">Komentar</label>
    <textarea value={comment} onChange={(event) => setComment(event.target.value)} className="mt-1 w-full rounded-md border p-2 dark:border-slate-600 dark:bg-slate-800" required rows={3} />
  </div>
);
