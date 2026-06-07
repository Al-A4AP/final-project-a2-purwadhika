import type { FC } from 'react';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { ErrorState } from '@/components/common/ErrorState';
import { Pagination } from '@/components/common/Pagination';
import { useCategoryViewState, type CategoryViewState } from '@/hooks/tenant/categories/useCategoryViewState';
import { CategoriesHeader } from './categories/CategoriesHeader';
import { CategoriesSummary } from './categories/CategoriesSummary';
import { CategoryListView } from './categories/CategoryListView';
import { CategoryFormModal } from './categories/CategoryFormModal';

const CategoriesPage: FC = () => {
  const view = useCategoryViewState();
  return <CategoryPageView view={view} />;
};

const CategoryPageView: FC<{ view: CategoryViewState }> = ({ view }) => (
  <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-10 dark:bg-slate-900 pb-24">
    <div className="mx-auto max-w-7xl">
      <CategoriesHeader onAdd={view.openAddModal} />
      <CategoriesSummary total={view.data.pagination.total || 0} />
      
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
