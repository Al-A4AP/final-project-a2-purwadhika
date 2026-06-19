import type { Order, PaginationMeta, TenantProperty } from "@/types";

export interface TenantOrderFilters {
  endDate: string;
  selectedPropertyId: string;
  selectedStatus: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  startDate: string;
}

export interface TenantOrderFilterActions {
  resetFilters: () => void;
  setEndDate: (value: string) => void;
  setSelectedPropertyId: (value: string) => void;
  setSelectedStatus: (value: string) => void;
  setSortBy: (value: string) => void;
  setSortOrder: (value: "asc" | "desc") => void;
  setStartDate: (value: string) => void;
}

export interface ConfirmModalState {
  confirmText: string;
  isOpen: boolean;
  message: string;
  onConfirm: (reason?: string) => void;
  reasonMaxLength?: number;
  reasonMinLength?: number;
  title: string;
  showReasonInput?: boolean;
}

export interface TenantOrdersState {
  confirmModal: ConfirmModalState;
  error: string | null;
  fetchOrders: (page?: number) => void;
  filterActions: TenantOrderFilterActions;
  filters: TenantOrderFilters;
  handleUpdateStatus: (orderId: string, status: string) => void;
  handleMarkRefundComplete: (orderId: string) => void;
  loading: boolean;
  orders: Order[];
  pagination: PaginationMeta;
  properties: TenantProperty[];
  updating: string | null;
}
