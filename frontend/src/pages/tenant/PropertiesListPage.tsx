import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, BedDouble, Star } from 'lucide-react';
import { tenantService } from '@/services/tenantService';
import type { TenantProperty } from '@/types';
import { formatPrice } from '@/lib/formatters';

const PropertiesListPage: FC = () => {
  const [properties, setProperties] = useState<TenantProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProperties = () =>
    tenantService.getProperties().then(setProperties).finally(() => setLoading(false));

  useEffect(() => { fetchProperties(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus properti "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    setDeletingId(id);
    try {
      await tenantService.deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch { alert('Gagal menghapus properti'); }
    finally { setDeletingId(null); }
  };

  if (loading) return (
    <div className="p-8 space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />)}
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Properti Saya</h1>
        <Link to="/tenant/properties/new"
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
        >
          <Plus size={16} /> Tambah Properti
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">Anda belum memiliki properti</p>
          <Link to="/tenant/properties/new" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
            Tambah Properti Pertama
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((p) => {
            const minPrice = p.rooms && p.rooms.length > 0
              ? Math.min(...p.rooms.map((r) => r.base_price))
              : null;
            return (
              <div key={p.id} className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm overflow-hidden flex">
                {p.featured_image_url && (
                  <img src={p.featured_image_url} alt={p.name} className="w-36 h-full object-cover shrink-0" />
                )}
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
                    <Link to={`/tenant/properties/${p.id}/rooms`}
                      className="text-xs px-3 py-1.5 border dark:border-slate-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                    >
                      Kamar
                    </Link>
                    <Link to={`/tenant/properties/${p.id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button onClick={() => handleDelete(p.id, p.name)} disabled={deletingId === p.id}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PropertiesListPage;
