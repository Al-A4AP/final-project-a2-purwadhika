import { Car, Coffee, Dumbbell, Monitor, Tv, Utensils, Waves, Wifi } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AmenityOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const AMENITIES_LIST: AmenityOption[] = [
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'parking', label: 'Parkir', icon: Car },
  { id: 'breakfast', label: 'Sarapan', icon: Coffee },
  { id: 'tv', label: 'TV', icon: Tv },
  { id: 'workspace', label: 'Ruang Kerja', icon: Monitor },
  { id: 'kitchen', label: 'Dapur', icon: Utensils },
  { id: 'pool', label: 'Kolam Renang', icon: Waves },
  { id: 'gym', label: 'Pusat Kebugaran', icon: Dumbbell },
];
