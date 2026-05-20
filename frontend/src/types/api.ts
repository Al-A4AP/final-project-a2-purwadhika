export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages?: number;
  totalPages?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}
