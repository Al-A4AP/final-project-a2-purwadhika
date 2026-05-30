import type { Room, RoomWithPeakRates } from './room';

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
  province?: string;
  amenities?: string[];
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

export interface PropertySearchFilters {
  city: string;
  check_in_date?: string;
  check_out_date?: string;
  capacity?: number;
  min_price?: number;
  max_price?: number;
  amenities?: string[];
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

export interface TenantProperty {
  id: string;
  tenantId: string;
  name: string;
  city: string;
  province?: string;
  address: string;
  description: string;
  amenities?: string[];
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
