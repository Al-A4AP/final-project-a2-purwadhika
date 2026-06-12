import type { PaginationMeta, Order } from "@/types";

export interface UserOrderFilters {
  checkInDate: string;
  checkOutDate: string;
  orderNumber: string;
  status: string;
  sortOrder: "asc" | "desc";
}

export interface UserOrderFilterActions {
  resetFilters: () => void;
  setCheckInDate: (value: string) => void;
  setCheckOutDate: (value: string) => void;
  setOrderNumber: (value: string) => void;
  setStatus: (value: string) => void;
  setSortOrder: (value: "asc" | "desc") => void;
}

export interface CancelOrderModalState {
  isOpen: boolean;
  orderId: string | null;
  orderNumber: string;
  status?: string;
  paymentMethod?: string;
}

export interface UserOrdersState {
  canceling: string | null;
  cancelModal: CancelOrderModalState;
  closeCancelModal: () => void;
  comment: string;
  confirmCancelOrder: () => void;
  error: string | null;
  fetchOrders: (page?: number) => void;
  filters: UserOrderFilters;
  filterActions: UserOrderFilterActions;
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => Promise<void>;
  handleCancelClick: (orderId: string) => void;
  retryMidtransPayment: (orderId: string) => void;
  switchToManualPayment: (orderId: string) => void;
  handleReviewSubmit: (event: React.FormEvent) => Promise<void>;
  handleUploadClick: (orderId: string) => void;
  loading: boolean;
  orders: Order[];
  pagination: PaginationMeta;
  paymentActionId: string | null;
  rating: number;
  reviewOrderId: string | null;
  setComment: (value: string) => void;
  setRating: (value: number) => void;
  setReviewOrderId: (value: string | null) => void;
  submittingReview: boolean;
  uploading: string | null;
}
