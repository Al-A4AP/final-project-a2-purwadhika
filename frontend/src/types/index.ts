// Common types
export type Role = 'USER' | 'TENANT';

export type OrderStatus = 
  | 'WAITING_PAYMENT' 
  | 'WAITING_CONFIRMATION' 
  | 'PROCESSED' 
  | 'CANCELLED';

export type PaymentMethod = 'MANUAL' | 'MIDTRANS';

// User & Auth
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  role: Role;
  verified_at: string | null;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Property
export interface PropertyCategory {
  id: string;
  name: string;
  icon?: string;
}

export interface Property {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  category: PropertyCategory;
  featured_image_url?: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  min_price: number;
  rating?: number;
  review_count?: number;
  created_at: string;
}

export interface PropertyDetail extends Property {
  images: PropertyImage[];
  rooms: Room[];
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  image_url: string;
  order: number;
}

export interface Room {
  id: string;
  propertyId: string;
  room_type: string;
  base_price: number;
  child_price?: number;
  description?: string;
  capacity: number;
  availability?: RoomAvailability[];
}

export interface RoomAvailability {
  id: string;
  roomId: string;
  date: string;
  is_available: boolean;
}

export interface PeakSeasonRate {
  id: string;
  roomId: string;
  start_date: string;
  end_date: string;
  rate_type: 'PERCENTAGE' | 'NOMINAL';
  rate_value: number;
  description?: string;
}

// Order
export interface Order {
  id: string;
  order_number: string;
  userId: string;
  roomId: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_proof_url?: string;
  midtrans_transaction_id?: string;
  payment_verified_at?: string;
  created_at: string;
  
  // Relations
  user?: { name: string; email: string; phone?: string };
  property?: { name: string; city: string; featured_image_url?: string };
  room?: { room_type: string; base_price: number };
  review?: Review;
}

// Review
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

// Pagination
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// Search & Filter
export interface PropertySearchFilters {
  city: string;
  check_in_date?: string;
  check_out_date?: string;
  capacity?: number;
  min_price?: number;
  max_price?: number;
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PriceCalendarDay {
  date: string;
  price: number;
  is_available: boolean;
}

// ─── Tenant Types ─────────────────────────────────────────────────────────────

export interface RoomWithPeakRates extends Room {
  peakRates: PeakSeasonRate[];
  deleted_at: string | null;
  created_at: string;
}

export interface TenantProperty {
  id: string;
  tenantId: string;
  name: string;
  city: string;
  address: string;
  description: string;
  featured_image_url: string | null;
  categoryId: string;
  latitude: number | null;
  longitude: number | null;
  category: PropertyCategory;
  rooms?: Array<{ base_price: number }>;
  _count: { rooms: number; orders: number; reviews: number };
  created_at: string;
}

export interface TenantPropertyDetail extends Omit<TenantProperty, 'rooms'> {
  images: PropertyImage[];
  rooms: RoomWithPeakRates[];
}

export interface RecentOrder {
  id: string;
  total_price: number;
  status: OrderStatus;
  created_at: string;
  user: { name: string };
  property: { name: string };
  room: { room_type: string };
}

export interface DashboardStats {
  propertyCount: number;
  roomCount: number;
  pendingOrders: number;
  monthlyRevenue: number;
  recentOrders: RecentOrder[];
}

export interface RoomFormInput {
  room_type: string;
  base_price: string;
  child_price?: string;
  capacity: string;
  description?: string;
}
