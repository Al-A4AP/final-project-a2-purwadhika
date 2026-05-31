import type { FC } from 'react';
import { useState } from 'react';
import { Tags } from 'lucide-react';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Pagination } from '@/components/common/Pagination';
import SortFilterBar, { type SortGroup } from '@/components/common/SortFilterBar';
import { CategoryForm } from '@/components/tenant/category/CategoryForm';
import { CategoryList } from '@/components/tenant/category/CategoryList';
import { useTenantCategories } from '@/hooks/useTenantCategories';
import type { PropertyCategory } from '@/types';

const sortGroups: SortGroup[] = [
  { key: 'name', label: 'Nama', icon: 'alpha', options: [{ order: 'asc', label: 'A-Z' }, { order: 'desc', label: 'Z-A' }] },
  { key: 'updated_at', label: 'Update', icon: 'clock', options: [{ order: 'desc', label: 'Terbaru' }, { order: 'asc', label: 'Terlama' }] },
];

const CategoriesPage: FC = () => {
  const data = useTenantCategories();
  const [editing, setEditing] = useState<PropertyCategory | null>(null);
  const [targetDelete, setTargetDelete] = useState<PropertyCategory | null>(null);
  const totalPages = data.pagination.totalPages || data.pagination.pages || 1;

  const handleSave = async (name: string) => {
    await data.saveCategory(name, editing);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!targetDelete) return;
    await data.deleteCategory(targetDelete);
    setTargetDelete(null);
  };

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div>
        <div className="flex items-center gap-3">
          <Tags className="text-red-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kategori Properti</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola kategori yang dipakai saat membuat properti.</p>
      </div>
      <CategoryForm key={editing?.id || 'new'} editing={editing} saving={data.saving} onSubmit={handleSave} onCancel={() => setEditing(null)} />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex max-w-md flex-1 gap-2">
          <input value={data.searchInput} onChange={(event) => data.setSearchInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') data.applySearch(); }} placeholder="Cari kategori..." className="flex-1 rounded-lg border px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
          <button onClick={data.applySearch} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-700">Cari</button>
        </div>
        <SortFilterBar sortGroups={sortGroups} currentSort={data.sortBy} currentOrder={data.sortOrder} onChange={(sort, order) => data.changeSort(sort as 'name' | 'updated_at', order)} resultCount={data.pagination.total} resultLabel="kategori" />
      </div>
      <CategoryList categories={data.categories} loading={data.loading} deletingId={data.deletingId} onEdit={setEditing} onDelete={setTargetDelete} />
      <Pagination currentPage={data.pagination.page} totalPages={totalPages} totalItems={data.pagination.total} onPageChange={data.load} />
      <ConfirmModal isOpen={Boolean(targetDelete)} title="Hapus Kategori" message={`Hapus kategori "${targetDelete?.name}"? Kategori yang sedang dipakai properti tidak dapat dihapus.`} confirmText="Ya" onConfirm={handleDelete} onCancel={() => setTargetDelete(null)} />
    </div>
  );
};

export default CategoriesPage;
