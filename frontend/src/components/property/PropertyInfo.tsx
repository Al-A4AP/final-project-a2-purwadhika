import type { FC, ReactNode } from 'react';
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
}) => (
  <PropertyInfoCard>
    <PropertyHeader categoryName={categoryName} name={name} address={address} city={city} minPrice={minPrice} />
    <AmenitiesSection amenities={amenities} />
    <DescriptionSection description={description} />
  </PropertyInfoCard>
);

const PropertyInfoCard: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border dark:border-slate-700 mb-8">
    {children}
  </div>
);

const PropertyHeader: FC<Omit<PropertyInfoProps, 'description' | 'amenities'>> = (props) => (
  <div className="flex justify-between items-start">
    <div>
      <CategoryBadge categoryName={props.categoryName} />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">{props.name}</h1>
      <LocationLine address={props.address} city={props.city} />
    </div>
    <PriceSummary minPrice={props.minPrice} />
  </div>
);

const CategoryBadge: FC<{ categoryName?: string }> = ({ categoryName }) =>
  categoryName ? (
    <span className="text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full">
      {categoryName}
    </span>
  ) : null;

const LocationLine: FC<{ address: string; city: string }> = ({ address, city }) => (
  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-2">
    <MapPin size={18} /> {address}, {city}
  </p>
);

const PriceSummary: FC<{ minPrice: number }> = ({ minPrice }) => (
  <div className="text-right">
    <p className="text-sm text-gray-500">Mulai dari</p>
    <p className="text-2xl font-bold text-red-600">{formatPrice(minPrice)}</p>
    <p className="text-sm text-gray-500">/ malam</p>
  </div>
);

const AmenitiesSection: FC<{ amenities?: string[] }> = ({ amenities }) =>
  amenities?.length ? (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Fasilitas</h2>
      <AmenitiesList amenities={amenities} />
    </div>
  ) : null;

const DescriptionSection: FC<{ description: string }> = ({ description }) => (
  <div className="mt-8">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tentang Properti</h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{description}</p>
  </div>
);
