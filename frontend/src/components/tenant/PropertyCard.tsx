import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, BedDouble, Star } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';
import type { TenantProperty } from '@/types';

interface PropertyCardProps {
  property: TenantProperty;
  deletingId: string | null;
  onDelete: (id: string, name: string) => void;
}

export const PropertyCard: FC<PropertyCardProps> = ({ property: p, deletingId, onDelete }) => {
  const minPrice = p.rooms && p.rooms.length > 0 ? Math.min(...p.rooms.map((r) => r.base_price)) : null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm overflow-hidden flex">
      {p.featured_image_url && <img src={p.featured_image_url} alt={p.name} className="w-36 h-full object-cover shrink-0" />}
      <div className="p-4 flex-1 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-red-50 text-red-600 dark:bg-red-900/20 px-2 py-0.5 rounded-full">{p.category?.name}</span>
            <span className="text-xs text-gray-400">{p.city}</span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{p.name}</h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1"><BedDouble size={12} /> {p._count?.rooms || 0} Kamar</span>
            <span className="flex items-center gap-1"><Star size={12} /> {p._count?.reviews || 0} Review</span>
            {minPrice && <span className="font-semibold text-red-600">{formatPrice(minPrice)}/malam</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link to={`/tenant/properties/${p.id}/rooms`} className="text-xs px-3 py-1.5 border dark:border-slate-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition">Kamar</Link>
          <Link to={`/tenant/properties/${p.id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"><Pencil size={16} /></Link>
          <button onClick={() => onDelete(p.id, p.name)} disabled={deletingId === p.id} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"><Trash2 size={16} /></button>
        </div>
      </div>
    </div>
  );
};
