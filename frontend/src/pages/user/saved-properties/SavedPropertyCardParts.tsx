import type { FC } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, Trash2 } from "lucide-react";
import type { SavedProperty } from "@/hooks/useSavedProperties";
import { formatPrice } from "@/lib/formatters";

const fallbackImage = "https://via.placeholder.com/300x200?text=Property";

export const SavedPropertyImage: FC<{ property: SavedProperty }> = ({ property }) => (
  <Link to={`/properties/${property.id}`} className="relative block h-48 w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
    <img src={property.featured_image_url || fallbackImage} alt={property.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
    <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">{property.category}</span>
  </Link>
);

export const SavedPropertyInfo: FC<{ property: SavedProperty }> = ({ property }) => (
  <div className="mb-3 flex items-start justify-between">
    <Link to={`/properties/${property.id}`} className="block"><h3 className="line-clamp-1 text-lg font-bold text-slate-900 transition hover:text-slate-600 dark:text-white dark:hover:text-slate-300">{property.name}</h3><div className="mt-1 flex items-center text-sm text-slate-500 dark:text-slate-400"><MapPin size={14} className="mr-1 shrink-0" /><span className="line-clamp-1">{property.city}</span></div></Link>
    {property.rating !== undefined && <RatingBadge value={property.rating} />}
  </div>
);

const RatingBadge: FC<{ value: number }> = ({ value }) => (
  <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-sm font-bold text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"><Star size={14} className="fill-current" /><span>{value.toFixed(1)}</span></div>
);

export const SavedPropertyPrice: FC<{ price: number }> = ({ price }) => (
  <div className="mb-4 flex items-end"><span className="text-xl font-black text-slate-900 dark:text-white">{formatPrice(price)}</span><span className="mb-1 ml-1 text-xs text-slate-500 dark:text-slate-400">/malam</span></div>
);

export const SavedPropertyActions: FC<{ id: string; onRemove: (id: string) => void }> = ({ id, onRemove }) => (
  <div className="flex gap-2">
    <Link to={`/properties/${id}`} className="flex-1 rounded-xl bg-slate-900 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">Lihat Detail</Link>
    <button type="button" onClick={() => onRemove(id)} className="flex w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:hover:border-red-900/50 dark:hover:bg-red-900/20 dark:hover:text-red-500" aria-label="Hapus dari tersimpan"><Trash2 size={16} /></button>
  </div>
);
