import type { FC } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
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
    <button onClick={() => onEdit(category)} className={`${actionClass} text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20`} aria-label="Edit kategori"><Pencil size={17} /></button>
    <button onClick={() => onDelete(category)} disabled={deletingId === category.id} className={`${actionClass} text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20`} aria-label="Hapus kategori"><Trash2 size={17} /></button>
  </div>
);

const CategoryRow: FC<Omit<CategoryListProps, 'categories' | 'loading'> & { category: PropertyCategory }> = (props) => (
  <tr className="border-b last:border-0 dark:border-slate-700">
    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{props.category.name}</td>
    <td className="px-4 py-3"><CategoryActions {...props} /></td>
  </tr>
);

const CategoryCard: FC<Omit<CategoryListProps, 'categories' | 'loading'> & { category: PropertyCategory }> = (props) => (
  <div className="flex items-center justify-between rounded-lg border bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
    <p className="min-w-0 truncate font-medium text-gray-900 dark:text-white">{props.category.name}</p>
    <CategoryActions {...props} />
  </div>
);

export const CategoryList: FC<CategoryListProps> = ({ categories, loading, ...actions }) => {
  if (loading) return <div className="space-y-3">{[1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-lg bg-gray-200 dark:bg-slate-700" />)}</div>;
  if (!categories.length) return <div className="rounded-lg border border-dashed p-10 text-center text-sm text-gray-500 dark:border-slate-700">Belum ada kategori ditemukan</div>;
  return (
    <>
      <div className="space-y-3 md:hidden">{categories.map((category) => <CategoryCard key={category.id} category={category} {...actions} />)}</div>
      <div className="hidden overflow-hidden rounded-lg border bg-white dark:border-slate-700 dark:bg-slate-800 md:block">
        <table className="w-full text-left text-sm"><tbody>{categories.map((category) => <CategoryRow key={category.id} category={category} {...actions} />)}</tbody></table>
      </div>
    </>
  );
};
