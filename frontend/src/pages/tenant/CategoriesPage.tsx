import type { FC } from 'react';
import { useState } from 'react';
import { Tags } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { ErrorState } from '@/components/common/ErrorState';
import { HelpText } from '@/components/common/HelpText';
import { Pagination } from '@/components/common/Pagination';
import SortFilterBar, { type SortGroup } from '@/components/common/SortFilterBar';
import { CategoryForm } from '@/components/tenant/category/CategoryForm';
import { CategoryList } from '@/components/tenant/category/CategoryList';
import { useTenantCategories } from '@/hooks/useTenantCategories';
import { isDefaultCategoryName } from '@/lib/defaultCategories';
import type { PropertyCategory } from '@/types';

type CategoryData = ReturnType<typeof useTenantCategories>;

interface CategoryViewState {
  data: CategoryData;
  editing: PropertyCategory | null;
  targetDelete: PropertyCategory | null;
  totalPages: number;
  handleDelete: () => Promise<void>;
  handleSave: (name: string) => Promise<void>;
  requestDelete: (category: PropertyCategory) => void;
  requestEdit: (category: PropertyCategory) => void;
  resetEditing: () => void;
  resetTargetDelete: () => void;
}

const sortGroups: SortGroup[] = [
  { key: 'name', label: 'Nama', icon: 'alpha', options: [{ order: 'asc', label: 'A-Z' }, { order: 'desc', label: 'Z-A' }] },
  { key: 'updated_at', label: 'Update', icon: 'clock', options: [{ order: 'desc', label: 'Terbaru' }, { order: 'asc', label: 'Terlama' }] },
];

const CategoriesPage: FC = () => {
  const view = useCategoryViewState();
  return <CategoryPageView view={view} />;
};

const useCategoryViewState = () => {
  const data = useTenantCategories();
  const [editing, setEditing] = useState<PropertyCategory | null>(null);
  const [targetDelete, setTargetDelete] = useState<PropertyCategory | null>(null);
  return {
    data, editing, targetDelete, totalPages: data.pagination.totalPages || data.pagination.pages || 1,
    handleDelete: createDeleteHandler(data, targetDelete, setTargetDelete),
    handleSave: createSaveHandler(data, editing, setEditing),
    requestDelete: createDeleteRequest(setTargetDelete),
    requestEdit: createEditRequest(setEditing),
    resetEditing: () => setEditing(null),
    resetTargetDelete: () => setTargetDelete(null),
  };
};

const createSaveHandler = (data: CategoryData, editing: PropertyCategory | null, setEditing: (category: PropertyCategory | null) => void) =>
  async (name: string) => { await data.saveCategory(name, editing); setEditing(null); };

const createDeleteHandler = (data: CategoryData, target: PropertyCategory | null, setTarget: (category: PropertyCategory | null) => void) =>
  async () => { if (!target) return; await data.deleteCategory(target); setTarget(null); };

const createEditRequest = (setEditing: (category: PropertyCategory) => void) =>
  (category: PropertyCategory) => { if (!guardDefaultCategory(category, 'diubah')) setEditing(category); };

const createDeleteRequest = (setTargetDelete: (category: PropertyCategory) => void) =>
  (category: PropertyCategory) => { if (!guardDefaultCategory(category, 'dihapus')) setTargetDelete(category); };

const guardDefaultCategory = (category: PropertyCategory, action: 'diubah' | 'dihapus') => {
  if (!isDefaultCategoryName(category.name)) return false;
  toast.error(`Kategori default sistem tidak bisa ${action}`);
  return true;
};

const CategoryPageView: FC<{ view: CategoryViewState }> = ({ view }) => (
  <div className="space-y-6 p-6 md:p-8">
    <CategoryHeader />
    <HelpText>Kategori akan muncul di form properti dan filter pencarian user, jadi gunakan nama yang singkat dan mudah dipahami.</HelpText>
    <CategoryForm key={view.editing?.id || 'new'} editing={view.editing} saving={view.data.saving} onSubmit={view.handleSave} onCancel={view.resetEditing} />
    <CategoryToolbar view={view} />
    <CategoryResults view={view} />
    <CategoryPagination view={view} />
    <CategoryDeleteModal view={view} />
  </div>
);

const CategoryHeader: FC = () => (
  <div>
    <div className="flex items-center gap-3">
      <Tags className="text-red-600" size={24} />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kategori Properti</h1>
    </div>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola kategori yang dipakai saat membuat properti.</p>
  </div>
);

const CategoryToolbar: FC<{ view: CategoryViewState }> = ({ view }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <CategorySearch data={view.data} />
    <SortFilterBar sortGroups={sortGroups} currentSort={view.data.sortBy} currentOrder={view.data.sortOrder} onChange={(sort, order) => view.data.changeSort(sort as 'name' | 'updated_at', order)} resultCount={view.data.pagination.total} resultLabel="kategori" />
  </div>
);

const CategorySearch: FC<{ data: CategoryData }> = ({ data }) => (
  <div className="flex max-w-md flex-1 gap-2">
    <input value={data.searchInput} onChange={(event) => data.setSearchInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') data.applySearch(); }} placeholder="Cari kategori..." className="flex-1 rounded-lg border px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
    <button onClick={data.applySearch} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-700">Cari</button>
  </div>
);

const CategoryResults: FC<{ view: CategoryViewState }> = ({ view }) => (
  view.data.error
    ? <ErrorState title="Kategori belum bisa dimuat" message={view.data.error} onRetry={() => view.data.load(view.data.pagination.page || 1)} />
    : <CategoryList categories={view.data.categories} loading={view.data.loading} deletingId={view.data.deletingId} onEdit={view.requestEdit} onDelete={view.requestDelete} />
);

const CategoryPagination: FC<{ view: CategoryViewState }> = ({ view }) => (
  !view.data.loading && !view.data.error && view.data.categories.length > 0
    ? <Pagination currentPage={view.data.pagination.page} totalPages={view.totalPages} totalItems={view.data.pagination.total} onPageChange={view.data.load} />
    : null
);

const CategoryDeleteModal: FC<{ view: CategoryViewState }> = ({ view }) => (
  <ConfirmModal isOpen={Boolean(view.targetDelete)} title="Hapus Kategori" message={`Hapus kategori "${view.targetDelete?.name}"? Kategori yang sedang dipakai properti tidak dapat dihapus.`} confirmText="Ya" onConfirm={view.handleDelete} onCancel={view.resetTargetDelete} />
);

export default CategoriesPage;
