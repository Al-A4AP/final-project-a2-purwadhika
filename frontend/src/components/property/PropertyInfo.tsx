import type { FC } from 'react';
import { MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';
import { AmenitiesList } from './AmenitiesList';

interface PropertyInfoProps {
  categoryName?: string;
  name: string;
  address: string;
  city: string;
  minPrice: number;
  description: string;
  amenities?: string[];
}

export const PropertyInfo: FC<PropertyInfoProps> = ({
  categoryName,
  name,
  address,
  city,
  minPrice,
  description,
  amenities,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border dark:border-slate-700 mb-8">
      <div className="flex justify-between items-start">
        <div>
          {categoryName && (
            <span className="text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full">
              {categoryName}
            </span>
          )}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">{name}</h1>
          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-2">
            <MapPin size={18} /> {address}, {city}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Mulai dari</p>
          <p className="text-2xl font-bold text-red-600">{formatPrice(minPrice)}</p>
          <p className="text-sm text-gray-500">/ malam</p>
        </div>
      </div>
      {amenities?.length ? (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Fasilitas</h2>
          <AmenitiesList amenities={amenities} />
        </div>
      ) : null}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tentang Properti</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>
    </div>
  );
};
