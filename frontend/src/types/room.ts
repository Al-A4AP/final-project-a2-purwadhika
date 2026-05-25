export interface RoomAvailability {
  id: string;
  roomId: string;
  date: string;
  is_available: boolean;
}

export interface RoomImage {
  id: string;
  roomId: string;
  image_url: string;
  order: number;
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

export interface Room {
  id: string;
  propertyId: string;
  room_type: string;
  base_price: number;
  child_price?: number;
  description?: string;
  capacity: number;
  quantity: number;
  availability?: RoomAvailability[];
  availabilities?: RoomAvailability[]; // from backend
  peakRates?: PeakSeasonRate[];
  images?: RoomImage[];
  is_available?: boolean;
  reason?: string;
  priceDetails?: {
    roomId: string;
    basePrice: number;
    nights: number;
    totalPrice: number;
    breakdown: {
      date: string;
      price: number;
      isPeak: boolean;
      rateName?: string;
    }[];
  };
}

export interface RoomWithPeakRates extends Room {
  peakRates: PeakSeasonRate[];
  deleted_at: string | null;
  created_at: string;
}

export interface RoomFormInput {
  room_type: string;
  base_price: string;
  child_price?: string;
  capacity: string;
  description?: string;
}
