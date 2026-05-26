import type { FC } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { tenantService } from '@/services/tenantService';
import type { TenantProperty, PaginationMeta } from '@/types';
import SortFilterBar from '@/components/common/SortFilterBar';
import type { SortGroup } from '@/components/common/SortFilterBar';
import { toast } from 'react-hot-toast';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Pagination } from '@/components/common/Pagination';
import { PropertyCard } from '@/components/tenant/PropertyCard';

const PropertiesListPage: FC = () => {
  const [properties, setProperties] = useState<TenantProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const tenantSortGroups: SortGroup[] = [
    { key: 'created_at', label: 'Tanggal', icon: 'clock', options: [{ order: 'desc', label: 'Terbaru' }, { order: 'asc', label: 'Terlama' }] },
    { key: 'name', label: 'Nama', icon: 'alpha', options: [{ order: 'asc', label: 'A → Z' }, { order: 'desc', label: 'Z → A' }] },
  ];

  const fetchProperties = useCallback((pageNumber = 1) => {
    setLoading(true);
    tenantService.getProperties({ search: activeSearch || undefined, sortBy: sortKey, sortOrder, page: pageNumber, limit: 10 })
      .then((data) => { setProperties(data.properties); setPagination(data.pagination); })
      .catch(() => toast.error('Gagal memuat properti'))
      .finally(() => setLoading(false));
  }, [activeSearch, sortKey, sortOrder]);

  useEffect(() => { Promise.resolve().then(() => fetchProperties(1)); }, [fetchProperties]);

  const handleDelete = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true, title: 'Hapus Properti',
      message: `Hapus properti "${name}"? Tindakan ini tidak dapat dibatalkan dan semua kamar serta peak rate di dalamnya akan ikut terhapus.`,
      onConfirm: async () => {
        setDeletingId(id);
        try {
          await tenantService.deleteProperty(id);
          setProperties((prev) => prev.filter((p) => p.id !== id));
          toast.success('Properti berhasil dihapus');
        } catch { toast.error('Gagal menghapus properti'); }
        finally { setDeletingId(null); setConfirmModal(prev => ({ ...prev, isOpen: false })); }
      }
    });
  };

  const totalPages = pagination.totalPages || pagination.pages || 1;

  if (loading) return <div className="p-8 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />)}</div>;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Properti Saya</h1>
        <Link to="/tenant/properties/new" className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"><Plus size={16} /> Tambah Properti</Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex gap-2 max-w-md flex-1">
          <input type="text" placeholder="Cari nama properti, alamat atau kota..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') setActiveSearch(searchQuery); }} className="flex-1 px-4 py-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white" />
          <button onClick={() => setActiveSearch(searchQuery)} className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-sm hover:bg-slate-800 transition">Cari</button>
        </div>
        {properties.length > 0 && <SortFilterBar sortGroups={tenantSortGroups} currentSort={sortKey} currentOrder={sortOrder} onChange={(sort, order) => { setSortKey(sort); setSortOrder(order); }} resultCount={pagination.total} resultLabel="properti" />}
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">Tidak ada properti ditemukan</p>
          <Link to="/tenant/properties/new" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">Tambah Properti Pertama</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((p) => <PropertyCard key={p.id} property={p} deletingId={deletingId} onDelete={handleDelete} />)}
        </div>
      )}

      <Pagination currentPage={pagination.page || 1} totalPages={totalPages} totalItems={pagination.total} onPageChange={fetchProperties} />
      <ConfirmModal isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message} onConfirm={confirmModal.onConfirm} onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} />
    </div>
  );
};

export default PropertiesListPage;
