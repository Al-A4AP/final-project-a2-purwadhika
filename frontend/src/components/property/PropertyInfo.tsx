import type { FC } from 'react';
import { MapPin, Star, Share2 } from 'lucide-react';
import type { Property } from '@/types';
import { AmenitiesList } from './AmenitiesList';
import { SavePropertyButton } from '@/components/user/property-card/SavePropertyButton';
import { usePropertyShare } from './usePropertyShare';

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
  property?: Property;
}

export const PropertyInfo: FC<PropertyInfoProps> = (props) => {
  const onShare = usePropertyShare(props);
  return (
    <div className="space-y-12">
      <PropertyHeader {...props} onShare={onShare} />
      <PropertyDescription description={props.description} />
      <PropertyFacilities amenities={props.amenities} />
    </div>
  );
};

const PropertyHeader: FC<PropertyInfoProps & { onShare: () => void }> = (props) => (
  <div>
    <PropertyMeta categoryName={props.categoryName} rating={props.rating} reviewCount={props.reviewCount} />
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <PropertyTitle address={props.address} city={props.city} name={props.name} />
      <PropertyActions onShare={props.onShare} property={props.property} />
    </div>
  </div>
);

const PropertyMeta: FC<Pick<PropertyInfoProps, "categoryName" | "rating" | "reviewCount">> = (props) => (
  <div className="mb-4 flex flex-wrap items-center gap-3">
    {props.categoryName && <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600 dark:bg-red-900/20">{props.categoryName}</span>}
    <div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
      <Star className="h-4 w-4 fill-rose-500 text-rose-500" />
      {props.rating > 0 ? props.rating.toFixed(1) : 'Baru'}
      <span className="ml-1 text-slate-500">({props.reviewCount} ulasan)</span>
    </div>
  </div>
);

const PropertyTitle: FC<Pick<PropertyInfoProps, "address" | "city" | "name">> = ({ address, city, name }) => (
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl">{name}</h1>
    <p className="mt-3 flex items-center gap-2 text-lg text-slate-600 dark:text-slate-400">
      <MapPin className="h-5 w-5 text-red-500" /> {address}, {city}
    </p>
  </div>
);

const PropertyActions: FC<{ onShare: () => void; property?: Property }> = ({ onShare, property }) => (
  <div className="flex shrink-0 gap-3">
    <button onClick={onShare} title="Bagikan properti" aria-label="Bagikan properti" className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
      <Share2 className="h-5 w-5" />
    </button>
    {property && <SavePropertyButton property={property} variant="outline" />}
  </div>
);

const PropertyDescription: FC<{ description: string }> = ({ description }) => (
  <div>
    <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Tentang Properti</h2>
    <div className="prose prose-slate max-w-none text-slate-600 dark:prose-invert dark:text-slate-400">
      <p className="whitespace-pre-line leading-relaxed">{description}</p>
    </div>
  </div>
);

const PropertyFacilities: FC<{ amenities?: string[] }> = ({ amenities }) => (
  amenities && amenities.length > 0 ? (
    <div>
      <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Fasilitas Utama</h2>
      <div className="rounded-2xl border border-slate-100 bg-white/50 p-6 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
        <AmenitiesList amenities={amenities} />
      </div>
    </div>
  ) : null
);
