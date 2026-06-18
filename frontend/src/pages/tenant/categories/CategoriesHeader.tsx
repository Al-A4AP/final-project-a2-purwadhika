import type { FC } from "react";
import { Plus } from "lucide-react";

interface CategoriesHeaderProps {
  categoryLimit: number;
  disabled: boolean;
  onAdd: () => void;
}

export const CategoriesHeader: FC<CategoriesHeaderProps> = (props) => (
  <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
    <CategoryHeaderCopy />
    <AddCategoryButton {...props} />
  </div>
);

const CategoryHeaderCopy = () => (
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Kategori Properti</h1>
    <p className="mt-2 text-slate-600 dark:text-slate-400">Kelola kategori yang digunakan sebagai filter pencarian properti.</p>
  </div>
);

const AddCategoryButton: FC<CategoriesHeaderProps> = ({ categoryLimit, disabled, onAdd }) => (
  <div className="flex shrink-0" title={disabled ? `Batas ${categoryLimit} kategori milik sendiri sudah tercapai` : undefined}>
    <button type="button" onClick={onAdd} disabled={disabled} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 md:w-auto">
      <Plus size={18} />
      {disabled ? "Batas Kategori Tercapai" : "Tambah Kategori"}
    </button>
  </div>
);
