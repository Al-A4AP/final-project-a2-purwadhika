import type { FC } from "react";
import { Trash2 } from "lucide-react";
import type { TenantReviewsState } from "@/hooks/tenant/reviews/tenantReviewsTypes";
import type { Review } from "@/types";

export const ReviewCardActions: FC<{ review: Review; state: TenantReviewsState }> = ({ review, state }) => {
  const deleting = state.deletingReviewId === review.id;
  return (
    <button
      type="button"
      onClick={() => state.openDeleteReview(review)}
      disabled={deleting}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20"
      title="Hapus ulasan"
      aria-label={`Hapus ulasan ${review.property?.name || review.id}`}
    >
      <Trash2 size={17} />
    </button>
  );
};
