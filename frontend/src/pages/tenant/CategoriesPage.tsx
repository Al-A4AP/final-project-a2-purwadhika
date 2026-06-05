import type { FC } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { ErrorState } from '@/components/common/ErrorState';
import { Pagination } from '@/components/common/Pagination';
import SortFilterBar, { type SortGroup } from '@/components/common/SortFilterBar';
import { useTenantCategories } from '@/hooks/useTenantCategories';
import { isDefaultCategoryName } from '@/lib/defaultCategories';
import type { PropertyCategory } from '@/types';
import { CategoriesHeader } from './categories/CategoriesHeader';
import { CategoriesSummary } from './categories/CategoriesSummary';
import { CategoryListView } from './categories/CategoryListView';
import { CategoryFormModal } from './categories/CategoryFormModal';
import { Search } from 'lucide-react';

type CategoryData = ReturnType<typeof useTenantCategories>;

interface CategoryViewState {
  data: CategoryData;
  editing: PropertyCategory | null;
  isAddModalOpen: boolean;
  targetDelete: PropertyCategory | null;
  totalPages: number;
  handleDelete: () => Promise<void>;
  handleSave: (name: string) => Promise<void>;
  requestDelete: (category: PropertyCategory) => void;
  requestEdit: (category: PropertyCategory) => void;
  openAddModal: () => void;
  closeModal: () => void;
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

const useCategoryViewState = (): CategoryViewState => {
  const data = useTenantCategories();
  const [editing, setEditing] = useState<PropertyCategory | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetDelete, setTargetDelete] = useState<PropertyCategory | null>(null);

  const guardDefaultCategory = (category: PropertyCategory, action: 'diubah' | 'dihapus') => {
    if (!isDefaultCategoryName(category.name)) return false;
    toast.error(`Kategori default sistem tidak bisa ${action}`);
    return true;
  };

  const handleSave = async (name: string) => { 
    await data.saveCategory(name, editing); 
    setEditing(null); 
    setIsAddModalOpen(false);
  };

  const handleDelete = async () => { 
    if (!targetDelete) return; 
    await data.deleteCategory(targetDelete); 
    setTargetDelete(null); 
  };

  return {
    data, 
    editing, 
    isAddModalOpen,
    targetDelete, 
    totalPages: data.pagination.totalPages || data.pagination.pages || 1,
    handleDelete,
    handleSave,
    requestDelete: (cat) => { if (!guardDefaultCategory(cat, 'dihapus')) setTargetDelete(cat); },
    requestEdit: (cat) => { if (!guardDefaultCategory(cat, 'diubah')) setEditing(cat); },
    openAddModal: () => setIsAddModalOpen(true),
    closeModal: () => { setEditing(null); setIsAddModalOpen(false); },
    resetTargetDelete: () => setTargetDelete(null),
  };
};

const CategoryPageView: FC<{ view: CategoryViewState }> = ({ view }) => (
  <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-10 dark:bg-slate-900 pb-24">
    <div className="mx-auto max-w-7xl">
      <CategoriesHeader onAdd={view.openAddModal} />
      <CategoriesSummary total={view.data.pagination.total || 0} />
      
      <CategoryToolbar view={view} />
      
      <div className="mt-6">
        <CategoryResults view={view} />
      </div>
      
      <div className="mt-8">
        <CategoryPagination view={view} />
      </div>

      <CategoryFormModal 
        isOpen={view.isAddModalOpen || Boolean(view.editing)} 
        editing={view.editing} 
        saving={view.data.saving} 
        onClose={view.closeModal} 
        onSubmit={view.handleSave} 
      />
      <CategoryDeleteModal view={view} />
    </div>
  </div>
);

const CategoryToolbar: FC<{ view: CategoryViewState }> = ({ view }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <CategorySearch data={view.data} />
    <SortFilterBar 
      sortGroups={sortGroups} 
      currentSort={view.data.sortBy} 
      currentOrder={view.data.sortOrder} 
      onChange={(sort, order) => view.data.changeSort(sort as 'name' | 'updated_at', order)} 
      resultCount={view.data.pagination.total} 
      resultLabel="kategori" 
    />
  </div>
);

const CategorySearch: FC<{ data: CategoryData }> = ({ data }) => (
  <div className="flex w-full md:w-96 gap-2">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <input 
        value={data.searchInput} 
        onChange={(event) => data.setSearchInput(event.target.value)} 
        onKeyDown={(event) => { if (event.key === 'Enter') data.applySearch(); }} 
        placeholder="Cari kategori..." 
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500" 
      />
    </div>
    <button 
      onClick={data.applySearch} 
      className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
    >
      Cari
    </button>
  </div>
);

const CategoryResults: FC<{ view: CategoryViewState }> = ({ view }) => (
  view.data.error
    ? <ErrorState title="Kategori gagal dimuat" message={view.data.error} onRetry={() => view.data.load(view.data.pagination.page || 1)} />
    : <CategoryListView categories={view.data.categories} loading={view.data.loading} deletingId={view.data.deletingId} onEdit={view.requestEdit} onDelete={view.requestDelete} />
);

const CategoryPagination: FC<{ view: CategoryViewState }> = ({ view }) => (
  !view.data.loading && !view.data.error && view.data.categories.length > 0
    ? <Pagination currentPage={view.data.pagination.page} totalPages={view.totalPages} totalItems={view.data.pagination.total} onPageChange={view.data.load} />
    : null
);

const CategoryDeleteModal: FC<{ view: CategoryViewState }> = ({ view }) => (
  <ConfirmModal 
    isOpen={Boolean(view.targetDelete)} 
    title="Hapus Kategori" 
    message={`Anda yakin ingin menghapus kategori "${view.targetDelete?.name}"? Kategori yang sedang dipakai properti tidak dapat dihapus.`} 
    confirmText="Ya, Hapus" 
    onConfirm={view.handleDelete} 
    onCancel={view.resetTargetDelete} 
  />
);

export default CategoriesPage;
