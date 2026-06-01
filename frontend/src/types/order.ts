import type { Review } from './review';

export type OrderStatus = 
  | 'WAITING_PAYMENT' 
  | 'WAITING_CONFIRMATION' 
  | 'PROCESSED' 
  | 'CANCELLED'
  | 'COMPLETED';

export type PaymentMethod = 'MANUAL' | 'MIDTRANS';
export type DashboardRevenuePeriod = 'weekly' | 'monthly' | 'quarterly' | 'six_months' | 'yearly';

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
  expires_at?: string;
  completed_at?: string;
  created_at: string;
  
  // Relations
  user?: { name: string; email: string; phone?: string };
  property?: { name: string; city: string; featured_image_url?: string };
  room?: { room_type: string; base_price: number };
  review?: Review;
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
  revenue: number;
  revenuePeriod: DashboardRevenuePeriod;
  monthlyRevenue: number;
  recentOrders: RecentOrder[];
}
