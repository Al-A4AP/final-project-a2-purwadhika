import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, BedDouble, Star } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';
import { isWholeUnitCategory } from '@/lib/categoryRental';
import type { TenantProperty } from '@/types';

interface PropertyCardProps {
  property: TenantProperty;
  deletingId: string | null;
  onDelete: (id: string, name: string) => void;
}

interface PropertyPartProps {
  property: TenantProperty;
}

interface PropertyActionsProps extends PropertyPartProps {
  deletingId: string | null;
  onDelete: (id: string, name: string) => void;
}

const getMinPrice = (property: TenantProperty) =>
  property.rooms?.length ? Math.min(...property.rooms.map((room) => room.base_price)) : null;

const PropertyImage: FC<PropertyPartProps> = ({ property }) =>
  property.featured_image_url ? (
    <img src={property.featured_image_url} alt={property.name} className="h-44 w-full object-cover sm:h-32 sm:w-36 sm:shrink-0" />
  ) : null;

const PropertyMeta: FC<PropertyPartProps> = ({ property }) => (
  <div className="mb-1 flex flex-wrap items-center gap-2">
    <span className="rounded-lg bg-red-50 px-2 py-0.5 text-xs text-red-600 dark:bg-red-900/20">{property.category?.name}</span>
    <span className="text-xs text-gray-400">{property.city}</span>
  </div>
);

const PropertyStats: FC<PropertyPartProps> = ({ property }) => {
  const minPrice = getMinPrice(property);

  return (
    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
      <span className="flex items-center gap-1"><BedDouble size={14} className="text-slate-400" /> {property._count?.rooms || 0} Kamar</span>
      <span className="flex items-center gap-1 font-medium"><Star size={14} className="text-rose-500 fill-rose-500" /> {property._count?.reviews || 0} Ulasan</span>
      {minPrice && <span className="font-semibold text-red-600">{formatPrice(minPrice)}/malam</span>}
    </div>
  );
};

const PropertySummary: FC<PropertyPartProps> = ({ property }) => (
  <div className="min-w-0">
    <PropertyMeta property={property} />
    <h3 className="truncate font-semibold text-gray-900 dark:text-white">{property.name}</h3>
    <PropertyStats property={property} />
  </div>
);

const RoomLink: FC<PropertyPartProps> = ({ property }) => (
  <Link to={`/tenant/properties/${property.id}/rooms`} className="flex h-11 items-center justify-center rounded-lg border px-3 text-sm text-gray-600 transition hover:bg-gray-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700" title="Kelola kamar" aria-label={`Kelola kamar ${property.name}`}>Kamar</Link>
);

const EditLink: FC<PropertyPartProps> = ({ property }) => (
  <Link to={`/tenant/properties/${property.id}/edit`} className="flex h-11 w-11 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-900/20" title="Edit properti" aria-label={`Edit properti ${property.name}`}><Pencil size={17} /></Link>
);

const DeleteButton: FC<PropertyActionsProps> = ({ property, deletingId, onDelete }) => (
  <button onClick={() => onDelete(property.id, property.name)} disabled={deletingId === property.id} className="flex h-11 w-11 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20" title="Hapus properti" aria-label={`Hapus properti ${property.name}`}><Trash2 size={17} /></button>
);

const PropertyActions: FC<PropertyActionsProps> = (props) => (
  <div className="grid grid-cols-[1fr_44px_44px] items-center gap-2 sm:flex sm:shrink-0">
    {!isWholeUnitCategory(props.property.category?.name) && <RoomLink property={props.property} />}
    <EditLink property={props.property} />
    <DeleteButton {...props} />
  </div>
);

export const PropertyCard: FC<PropertyCardProps> = ({ property, deletingId, onDelete }) => (
  <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white/90 backdrop-blur-lg shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 sm:flex-row">
    <PropertyImage property={property} />
    <div className="flex flex-1 flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <PropertySummary property={property} />
      <PropertyActions property={property} deletingId={deletingId} onDelete={onDelete} />
    </div>
  </div>
);
