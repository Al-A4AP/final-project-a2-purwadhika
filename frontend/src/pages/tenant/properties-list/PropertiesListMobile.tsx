import type { FC } from "react";
import { MapPin } from "lucide-react";
import type { PropertiesListViewProps, PropertyItemProps, PropertyOnlyProps } from "./propertiesListTypes";
import { getRoomCount } from "./propertiesListHelpers";
import { DeletePropertyButton, EditPropertyLink, PropertyCategoryBadge, PropertyImage, RoomsLink } from "./PropertiesListParts";

export const MobilePropertiesList: FC<PropertiesListViewProps> = ({ properties, deletingId, onDelete }) => (
  <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
    {properties.map((property) => (
      <MobilePropertyCard key={property.id} deletingId={deletingId} onDelete={onDelete} property={property} />
    ))}
  </div>
);

const MobilePropertyCard: FC<PropertyItemProps> = ({ property, deletingId, onDelete }) => (
  <div className="p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
    <div className="flex gap-4">
      <PropertyImage className="h-24 w-24 rounded-xl" property={property} />
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <MobilePropertyMeta property={property} />
        <MobilePropertyActions deletingId={deletingId} onDelete={onDelete} property={property} />
      </div>
    </div>
  </div>
);

const MobilePropertyMeta: FC<PropertyOnlyProps> = ({ property }) => (
  <div>
    <h3 className="truncate font-bold text-slate-900 dark:text-white">{property.name}</h3>
    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
      <PropertyCategoryBadge name={property.category?.name} />
      <span className="flex items-center gap-1"><MapPin size={12} /> {property.city}</span>
    </div>
  </div>
);

const MobilePropertyActions: FC<PropertyItemProps> = ({ property, deletingId, onDelete }) => (
  <div className="mt-3 flex items-center justify-between">
    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{getRoomCount(property)} Kamar</span>
    <div className="flex items-center gap-1">
      <RoomsLink compact property={property} />
      <EditPropertyLink compact property={property} />
      <DeletePropertyButton compact deletingId={deletingId} onDelete={onDelete} property={property} />
    </div>
  </div>
);
