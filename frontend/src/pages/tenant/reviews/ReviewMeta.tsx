import type { FC } from "react";
import type { Review } from "@/types";
import { formatReviewDate } from "./reviewDate";
import { Building2 } from "lucide-react";

export const ReviewMeta: FC<{ review: Review }> = ({ review }) => (
  <div className="flex flex-col items-end gap-1.5">
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300">
      <Building2 size={13} className="text-slate-400" />
      {review.property?.name || "Properti Dihapus"}
    </span>
    <p className="text-xs text-slate-400">{formatReviewDate(review.created_at)}</p>
  </div>
);
