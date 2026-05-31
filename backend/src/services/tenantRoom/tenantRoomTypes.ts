import type { RateType } from '@prisma/client';

export interface RoomFormData {
  room_type?: string;
  base_price?: string | number;
  child_price?: string | number | null;
  capacity?: string | number;
  quantity?: string | number;
  description?: string | null;
}

export interface PeakRateFormData {
  start_date: string | Date;
  end_date: string | Date;
  rate_type: RateType;
  rate_value: string | number;
  description?: string | null;
}
