import type { FC, ReactNode } from "react";
import { Pencil, Trash2, Tag, CalendarClock } from "lucide-react";
import { isDefaultCategoryName } from "@/lib/defaultCategories";
import type { PropertyCategory } from "@/types";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionLoading } from "@/components/common/SectionLoading";

interface CategoryListViewProps {
  categories: PropertyCategory[];
  loading: boolean;
  deletingId?: string | null;
  onEdit: (category: PropertyCategory) => void;
  onDelete: (category: PropertyCategory) => void;
}

const DefaultBadge: FC<{ name: string }> = ({ name }) => (
  isDefaultCategoryName(name) ? (
    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
      Default
    </span>
  ) : null
);

const CategoryActions: FC<{
  category: PropertyCategory;
  deletingId?: string | null;
  onDelete: (category: PropertyCategory) => void;
  onEdit: (category: PropertyCategory) => void;
}> = ({ category, deletingId, onDelete, onEdit }) => {
  if (isDefaultCategoryName(category.name)) return <span className="text-xs font-semibold text-slate-400">Default sistem</span>;
  return (
    <div className="flex items-center justify-end gap-2">
      <CategoryActionButton label="Edit kategori" onClick={() => onEdit(category)}><Pencil size={16} /></CategoryActionButton>
      <CategoryActionButton danger disabled={deletingId === category.id} label="Hapus kategori" onClick={() => onDelete(category)}><Trash2 size={16} /></CategoryActionButton>
    </div>
  );
};

const CategoryActionButton: FC<{ children: ReactNode; danger?: boolean; disabled?: boolean; label: string; onClick: () => void }> = ({ children, danger, disabled, label, onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={danger ? deleteButtonClass : editButtonClass}
    title={label}
    aria-label={label}
  >
    {children}
  </button>
);

export const CategoryListView: FC<CategoryListViewProps> = ({ categories, loading, deletingId, onEdit, onDelete }) => {
  if (loading) {
    return <SectionLoading variant="table" label="Memuat daftar kategori..." />;
  }

  if (!categories.length) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <EmptyState 
          title="Tidak ada kategori" 
          description="Kategori tidak ditemukan. Tambahkan kategori untuk mulai mengorganisir properti Anda." 
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">Nama Kategori</th>
              <th scope="col" className="px-6 py-4 font-semibold">Terakhir Diperbarui</th>
              <th scope="col" className="px-6 py-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {categories.map((category) => (
              <tr key={category.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <Tag size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white">{category.name}</span>
                        <DefaultBadge name={category.name} />
                      </div>
                      <span className="text-xs text-slate-500">ID: {category.id.substring(0, 8)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {category.updated_at ? (
                    <div className="flex items-center gap-2">
                      <CalendarClock size={16} className="text-slate-400" />
                      <span>{new Date(category.updated_at).toLocaleDateString('id-ID')}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <CategoryActions category={category} deletingId={deletingId} onDelete={onDelete} onEdit={onEdit} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const editButtonClass = "flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-900/50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400";
const deleteButtonClass = "flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900/50 dark:hover:bg-red-900/20 dark:hover:text-red-400";
