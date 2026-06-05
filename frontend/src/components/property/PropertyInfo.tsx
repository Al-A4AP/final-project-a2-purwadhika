import type { FC } from 'react';
import { MapPin, Star, Share2 } from 'lucide-react';
import { AmenitiesList } from './AmenitiesList';
import { SavePropertyButton } from '@/components/user/property-card/SavePropertyButton';

interface PropertyInfoProps {
  categoryName?: string;
  name: string;
  address: string;
  city: string;
  minPrice: number;
  description: string;
  amenities?: string[];
  rating: number;
  reviewCount: number;
  property?: import('@/types').Property;
}

export const PropertyInfo: FC<PropertyInfoProps> = ({
  categoryName,
  name,
  address,
  city,
  description,
  amenities,
  rating,
  reviewCount,
  property,
}) => (
  <div className="space-y-12">
    {/* Header */}
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {categoryName && (
          <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600 dark:bg-red-900/20">
            {categoryName}
          </span>
        )}
        <div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <Star className="h-4 w-4 text-rose-500 fill-rose-500" />
          {rating > 0 ? rating.toFixed(1) : 'Baru'}
          <span className="ml-1 text-slate-500">({reviewCount} ulasan)</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl">
            {name}
          </h1>
          <p className="mt-3 flex items-center gap-2 text-lg text-slate-600 dark:text-slate-400">
            <MapPin className="h-5 w-5 text-red-500" /> {address}, {city}
          </p>
        </div>
        
        {/* Share & Save Actions */}
        <div className="flex shrink-0 gap-3">
          <button className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
            <Share2 className="h-5 w-5" />
          </button>
          {property && <SavePropertyButton property={property} className="h-12! w-12! border! border-slate-200! bg-white! shadow-sm! hover:bg-slate-50! dark:border-slate-700! dark:bg-slate-800! dark:hover:bg-slate-700!" />}
        </div>
      </div>
    </div>

    {/* Description */}
    <div>
      <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Tentang Properti</h2>
      <div className="prose prose-slate max-w-none text-slate-600 dark:prose-invert dark:text-slate-400">
        <p className="leading-relaxed whitespace-pre-line">{description}</p>
      </div>
    </div>

    {/* Facilities */}
    {amenities && amenities.length > 0 && (
      <div>
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Fasilitas Utama</h2>
        <div className="rounded-2xl border border-slate-100 bg-white/50 p-6 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
          <AmenitiesList amenities={amenities} />
        </div>
      </div>
    )}
  </div>
);
