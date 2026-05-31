import type { PaginationMeta, Order } from "@/types";

export interface UserOrderFilters {
  endDate: string;
  orderNumber: string;
  startDate: string;
  status: string;
}

export interface UserOrderFilterActions {
  setEndDate: (value: string) => void;
  setOrderNumber: (value: string) => void;
  setStartDate: (value: string) => void;
  setStatus: (value: string) => void;
}

export interface UserOrdersState {
  comment: string;
  error: string | null;
  fetchOrders: (page?: number) => void;
  filters: UserOrderFilters;
  filterActions: UserOrderFilterActions;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleReviewSubmit: (event: React.FormEvent) => Promise<void>;
  handleUploadClick: (orderId: string) => void;
  loading: boolean;
  orders: Order[];
  pagination: PaginationMeta;
  rating: number;
  reviewOrderId: string | null;
  setComment: (value: string) => void;
  setRating: (value: number) => void;
  setReviewOrderId: (value: string | null) => void;
  submittingReview: boolean;
  uploading: string | null;
}
