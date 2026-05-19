import { api } from './api';
import type { ApiResponse } from '@/types';
import type { Review } from '@/types';

export const reviewService = {
  async getPropertyReviews(propertyId: string): Promise<Review[]> {
    const res = await api.get<ApiResponse<Review[]>>(`/properties/${propertyId}/reviews`);
    return res.data.data;
  },

  async createReview(orderId: string, rating: number, comment: string): Promise<Review> {
    const res = await api.post<ApiResponse<Review>>(`/orders/${orderId}/reviews`, { rating, comment });
    return res.data.data;
  },

  async replyReview(reviewId: string, reply_text: string): Promise<null> {
    const res = await api.post<ApiResponse<null>>(`/reviews/${reviewId}/reply`, { reply_text });
    return res.data.data;
  }
};
