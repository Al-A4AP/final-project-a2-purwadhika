import { Car, Coffee, Dumbbell, Monitor, Tv, Utensils, Waves, Wifi } from 'lucide-react';
import type { AmenityOption } from './types';

export const AMENITIES_LIST: AmenityOption[] = [
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'parking', label: 'Parkir', icon: Car },
  { id: 'breakfast', label: 'Sarapan', icon: Coffee },
  { id: 'tv', label: 'TV', icon: Tv },
  { id: 'workspace', label: 'Kerja', icon: Monitor },
  { id: 'kitchen', label: 'Dapur', icon: Utensils },
  { id: 'pool', label: 'Kolam', icon: Waves },
  { id: 'gym', label: 'Gym', icon: Dumbbell },
];

export const PANEL_CLASS =
  'absolute left-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl p-5 z-40 origin-top-left animate-fade-in';
