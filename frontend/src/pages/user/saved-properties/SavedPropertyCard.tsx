import type { FC } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, Trash2 } from "lucide-react";
import type { SavedProperty } from "@/hooks/useSavedProperties";
import { formatPrice } from "@/lib/formatters";

interface SavedPropertyCardProps {
  property: SavedProperty;
  onRemove: (id: string) => void;
}

const fallbackImage = "https://via.placeholder.com/300x200?text=Property";

export const SavedPropertyCard: FC<SavedPropertyCardProps> = ({ property, onRemove }) => {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-slate-800">
      <Link to={`/properties/${property.id}`} className="block relative h-48 w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
        <img 
          src={property.featured_image_url || fallbackImage} 
          alt={property.name} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
          {property.category}
        </div>
      </Link>
      
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <Link to={`/properties/${property.id}`} className="block">
            <h3 className="line-clamp-1 text-lg font-bold text-slate-900 transition hover:text-slate-600 dark:text-white dark:hover:text-slate-300">
              {property.name}
            </h3>
            <div className="mt-1 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <MapPin size={14} className="mr-1 shrink-0" />
              <span className="line-clamp-1">{property.city}</span>
            </div>
          </Link>
          
          {property.rating !== undefined && (
            <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-sm font-bold text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <Star size={14} className="fill-current" />
              <span>{property.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="mb-4 flex items-end">
          <span className="text-xl font-black text-slate-900 dark:text-white">
            {formatPrice(property.min_price)}
          </span>
          <span className="mb-1 ml-1 text-xs text-slate-500 dark:text-slate-400">/malam</span>
        </div>

        <div className="flex gap-2">
          <Link 
            to={`/properties/${property.id}`} 
            className="flex-1 rounded-xl bg-slate-900 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Lihat Detail
          </Link>
          <button
            onClick={() => onRemove(property.id)}
            className="flex w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:hover:border-red-900/50 dark:hover:bg-red-900/20 dark:hover:text-red-500"
            aria-label="Hapus dari tersimpan"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
