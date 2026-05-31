import type { FC } from "react";
import type { Review } from "@/types";
import { formatReviewDate } from "./reviewDate";

export const ReviewMeta: FC<{ review: Review }> = ({ review }) => (
  <div className="text-right"><p className="text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-700/50 px-3 py-1 rounded-lg inline-block">{review.property?.name || "Properti Dihapus"}</p><p className="text-xs text-gray-500 mt-1">{formatReviewDate(review.created_at)}</p></div>
);
