import type { FC } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, BedDouble, MapPin, CalendarClock } from "lucide-react";
import type { TenantProperty } from "@/types";
import { formatPrice } from "@/lib/formatters";

interface PropertiesListViewProps {
  properties: TenantProperty[];
  deletingId: string | null;
  onDelete: (id: string, name: string) => void;
}

const fallbackImage = "https://via.placeholder.com/300x200?text=Property";

export const PropertiesListView: FC<PropertiesListViewProps> = ({ properties, deletingId, onDelete }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      
      {/* Mobile View: Cards */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {properties.map(property => (
          <div key={property.id} className="p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <div className="flex gap-4">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                <img src={property.featured_image_url || fallbackImage} alt={property.name} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                  <h3 className="truncate font-bold text-slate-900 dark:text-white">{property.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {property.category?.name}
                    </span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {property.city}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {property._count?.rooms || 0} Kamar
                  </span>
                  <div className="flex items-center gap-1">
                    <Link to={`/tenant/properties/${property.id}/rooms`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Kamar</Link>
                    <Link to={`/tenant/properties/${property.id}/edit`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-blue-600 transition hover:bg-blue-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-blue-900/20"><Pencil size={14} /></Link>
                    <button onClick={() => onDelete(property.id, property.name)} disabled={deletingId === property.id} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-slate-700 dark:text-red-400 dark:hover:bg-red-900/20"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">Properti</th>
              <th scope="col" className="px-6 py-4 font-semibold">Status / Info</th>
              <th scope="col" className="px-6 py-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {properties.map(property => {
              const minPrice = property.rooms?.length ? Math.min(...property.rooms.map(r => r.base_price)) : null;

              return (
                <tr key={property.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                        <img src={property.featured_image_url || fallbackImage} alt={property.name} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900 dark:text-white text-base">{property.name}</span>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {property.category?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <MapPin size={12} className="text-red-500" />
                          <span>{property.city}</span>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span>ID: {property.id.substring(0, 8)}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <BedDouble size={14} className="text-slate-400" /> 
                        {property._count?.rooms || 0} Kamar Tersedia
                      </div>
                      {minPrice !== null && (
                        <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          Mulai {formatPrice(minPrice)}/malam
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <CalendarClock size={12} /> Dibuat: {new Date(property.created_at).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/tenant/properties/${property.id}/rooms`} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                        Kelola Kamar
                      </Link>
                      <Link
                        to={`/tenant/properties/${property.id}/edit`}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-900/50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                        title="Edit properti"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => onDelete(property.id, property.name)}
                        disabled={deletingId === property.id}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900/50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                        title="Hapus properti"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
