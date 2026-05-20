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
  replies?: ReviewReply[];
}

export interface ReviewReply {
  id: string;
  reviewId: string;
  tenantId: string;
  reply_text: string;
  created_at: string;
}
