import type { FC } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, BedDouble, MapPin, CalendarClock } from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import type { CompactPropertyActionProps, DeleteButtonProps, PropertyImageProps, PropertyOnlyProps } from "./propertiesListTypes";
import { getRoomCount } from "./propertiesListHelpers";

const fallbackImage = "https://via.placeholder.com/300x200?text=Property";

export const PropertyImage: FC<PropertyImageProps> = ({ property, className }) => (
  <div className={`shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800 ${className}`}>
    <img src={property.featured_image_url || fallbackImage} alt={property.name} className="h-full w-full object-cover" loading="lazy" />
  </div>
);

export const PropertyCategoryBadge: FC<{ name?: string }> = ({ name }) => (
  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
    {name}
  </span>
);

export const PropertyLocationMeta: FC<PropertyOnlyProps> = ({ property }) => (
  <div className="flex items-center gap-2 text-xs text-slate-500">
    <MapPin size={12} className="text-red-500" />
    <span>{property.city}</span>
    <span className="text-slate-300 dark:text-slate-600">{"\u00e2\u20ac\u00a2"}</span>
    <span>ID: {property.id.substring(0, 8)}</span>
  </div>
);

export const RoomCountInfo: FC<PropertyOnlyProps> = ({ property }) => (
  <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
    <BedDouble size={14} className="text-slate-400" />
    {getRoomCount(property)} Kamar Tersedia
  </div>
);

export const MinPriceInfo: FC<{ minPrice: number }> = ({ minPrice }) => (
  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
    Mulai {formatPrice(minPrice)}/malam
  </div>
);

export const CreatedAtInfo: FC<PropertyOnlyProps> = ({ property }) => (
  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
    <CalendarClock size={12} /> Dibuat: {new Date(property.created_at).toLocaleDateString("id-ID")}
  </div>
);

export const RoomsLink: FC<CompactPropertyActionProps> = ({ property, compact = false }) => {
  if (property.rental_type === "WHOLE_PROPERTY") return null;
  const label = compact ? "Kamar" : "Kelola Kamar";
  return <Link className={compact ? mobileRoomsLinkClass : desktopRoomsLinkClass} to={`/tenant/properties/${property.id}/rooms`}>{label}</Link>;
};

export const EditPropertyLink: FC<CompactPropertyActionProps> = ({ property, compact = false }) => (
  <Link className={compact ? mobileEditLinkClass : desktopIconLinkClass} title="Edit properti" to={`/tenant/properties/${property.id}/edit`}>
    <Pencil size={compact ? 14 : 16} />
  </Link>
);

export const DeletePropertyButton: FC<DeleteButtonProps> = ({ property, deletingId, onDelete, compact = false }) => (
  <button className={compact ? mobileDeleteButtonClass : desktopDeleteButtonClass} disabled={deletingId === property.id} onClick={() => onDelete(property.id, property.name)} title="Hapus properti">
    <Trash2 size={compact ? 14 : 16} />
  </button>
);

const mobileRoomsLinkClass = "rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800";
const desktopRoomsLinkClass = "rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700";
const mobileEditLinkClass = "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-blue-600 transition hover:bg-blue-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-blue-900/20";
const mobileDeleteButtonClass = "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-slate-700 dark:text-red-400 dark:hover:bg-red-900/20";
const desktopIconLinkClass = "flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-900/50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400";
const desktopDeleteButtonClass = "flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900/50 dark:hover:bg-red-900/20 dark:hover:text-red-400";
