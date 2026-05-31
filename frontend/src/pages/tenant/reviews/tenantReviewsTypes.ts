import type { Review, PaginationMeta } from "@/types";

export type ReplyTextMap = Record<string, string>;
export type SubmittingMap = Record<string, boolean>;

export interface TenantReviewsState {
  handlePageChange: (page: number) => void;
  handleReplyChange: (reviewId: string, text: string) => void;
  handleReplySubmit: (reviewId: string) => Promise<void>;
  loading: boolean;
  pagination: PaginationMeta;
  replyText: ReplyTextMap;
  reviews: Review[];
  submitting: SubmittingMap;
}
