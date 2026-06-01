import type { FC } from 'react';
import { EmptyState } from '@/components/common/EmptyState';
import { Pencil, Trash2 } from 'lucide-react';
import { isDefaultCategoryName } from '@/lib/defaultCategories';
import type { PropertyCategory } from '@/types';

interface CategoryListProps {
  categories: PropertyCategory[];
  loading: boolean;
  deletingId?: string | null;
  onEdit: (category: PropertyCategory) => void;
  onDelete: (category: PropertyCategory) => void;
}

const actionClass = 'flex h-10 w-10 items-center justify-center rounded-lg transition';

const CategoryActions: FC<Omit<CategoryListProps, 'categories' | 'loading'> & { category: PropertyCategory }> = ({ category, deletingId, onEdit, onDelete }) => (
  <div className="flex items-center justify-end gap-2">
    <button onClick={() => onEdit(category)} className={`${actionClass} text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20`} title="Edit kategori" aria-label={`Edit kategori ${category.name}`}><Pencil size={17} /></button>
    <button onClick={() => onDelete(category)} disabled={deletingId === category.id} className={`${actionClass} text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20`} title="Hapus kategori" aria-label={`Hapus kategori ${category.name}`}><Trash2 size={17} /></button>
  </div>
);

const DefaultBadge: FC<{ name: string }> = ({ name }) => (
  isDefaultCategoryName(name) ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">Default Sistem</span> : null
);

const CategoryName: FC<{ category: PropertyCategory }> = ({ category }) => (
  <div className="flex min-w-0 flex-wrap items-center gap-2">
    <span className="truncate">{category.name}</span>
    <DefaultBadge name={category.name} />
  </div>
);

const CategoryRow: FC<Omit<CategoryListProps, 'categories' | 'loading'> & { category: PropertyCategory }> = (props) => (
  <tr className="border-b last:border-0 dark:border-slate-700">
    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white"><CategoryName category={props.category} /></td>
    <td className="px-4 py-3"><CategoryActions {...props} /></td>
  </tr>
);

const CategoryCard: FC<Omit<CategoryListProps, 'categories' | 'loading'> & { category: PropertyCategory }> = (props) => (
  <div className="flex items-center justify-between gap-3 rounded-lg border bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
    <div className="min-w-0 font-medium text-gray-900 dark:text-white"><CategoryName category={props.category} /></div>
    <CategoryActions {...props} />
  </div>
);

export const CategoryList: FC<CategoryListProps> = ({ categories, loading, ...actions }) => {
  if (loading) return <div className="space-y-3">{[1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-lg bg-gray-200 dark:bg-slate-700" />)}</div>;
  if (!categories.length) return <EmptyState title="Belum ada kategori ditemukan" description="Kategori yang Anda buat akan muncul di daftar ini." />;
  return (
    <>
      <div className="space-y-3 md:hidden">{categories.map((category) => <CategoryCard key={category.id} category={category} {...actions} />)}</div>
      <div className="hidden overflow-hidden rounded-lg border bg-white dark:border-slate-700 dark:bg-slate-800 md:block">
        <table className="w-full text-left text-sm"><tbody>{categories.map((category) => <CategoryRow key={category.id} category={category} {...actions} />)}</tbody></table>
      </div>
    </>
  );
};
