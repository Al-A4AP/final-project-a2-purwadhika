import type { Review, PaginationMeta, TenantReviewSummary } from "@/types";

export type ReplyTextMap = Record<string, string>;
export type SubmittingMap = Record<string, boolean>;

export interface TenantReviewsState {
  closeDeleteReview: () => void;
  confirmDeleteReview: () => Promise<void>;
  deleteTarget: Review | null;
  deletingReviewId: string | null;
  error: string | null;
  fetchReviews: (page?: number) => Promise<void>;
  handlePageChange: (page: number) => void;
  handleReplyChange: (reviewId: string, text: string) => void;
  handleReplySubmit: (reviewId: string) => Promise<void>;
  loading: boolean;
  pagination: PaginationMeta;
  replyText: ReplyTextMap;
  reviews: Review[];
  openDeleteReview: (review: Review) => void;
  submitting: SubmittingMap;
  summary: TenantReviewSummary;
}
