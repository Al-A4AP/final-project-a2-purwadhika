import type { User } from './auth';

export interface Review {
  id: string;
  orderId: string;
  propertyId: string;
  userId: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: User;
  property?: { id: string; name: string };
  replies?: ReviewReply[];
}

export interface ReviewReply {
  id: string;
  reviewId: string;
  tenantId: string;
  reply_text: string;
  created_at: string;
}

export interface ReviewRatingSummaryItem {
  averageRating: number;
  id: string;
  name: string;
  totalReviews: number;
}

export interface TenantReviewSummary {
  byCategory: ReviewRatingSummaryItem[];
  byProperty: ReviewRatingSummaryItem[];
}
