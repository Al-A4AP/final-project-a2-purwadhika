import type { FC, ReactNode } from "react";
import { CalendarClock, Pencil, Tag, Trash2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import type { PropertyCategory } from "@/types";

interface CategoryActionProps {
  category: PropertyCategory;
  deletingId?: string | null;
  onDelete: (category: PropertyCategory) => void;
  onEdit: (category: PropertyCategory) => void;
}

type CategoryTableProps = Omit<CategoryActionProps, "category"> & {
  categories: PropertyCategory[];
};

export const CategoryTable: FC<CategoryTableProps> = (props) => (
  <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="overflow-x-auto"><table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
      <CategoryTableHead />
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
        {props.categories.map((category) => <CategoryRow key={category.id} {...props} category={category} />)}
      </tbody>
    </table></div>
  </div>
);

const CategoryTableHead = () => (
  <thead className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
    <tr><th scope="col" className="px-6 py-4 font-semibold">Nama Kategori</th><th scope="col" className="px-6 py-4 font-semibold">Terakhir Diperbarui</th><th scope="col" className="px-6 py-4 text-right font-semibold">Aksi</th></tr>
  </thead>
);

const CategoryRow: FC<CategoryActionProps> = (props) => (
  <tr className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
    <td className="px-6 py-4"><CategoryIdentity category={props.category} /></td>
    <td className="px-6 py-4"><UpdatedAt value={props.category.updated_at} /></td>
    <td className="px-6 py-4 text-right"><CategoryActions {...props} /></td>
  </tr>
);

const CategoryIdentity: FC<{ category: PropertyCategory }> = ({ category }) => (
  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"><Tag size={18} /></div>
    <div><div className="flex items-center gap-2"><span className="font-semibold text-slate-900 dark:text-white">{category.name}</span><CategoryBadge category={category} /></div><span className="text-xs text-slate-500">ID: {category.id.substring(0, 8)}</span></div>
  </div>
);

const CategoryBadge: FC<{ category: PropertyCategory }> = ({ category }) => {
  const user = useAuthStore((state) => state.user);
  if (category.tenantId === null) return <Badge className={systemBadgeClass}>Default Sistem</Badge>;
  if (user && category.tenantId !== user.id) return <Badge className={sharedBadgeClass}>Dipakai Bersama</Badge>;
  return null;
};

const Badge: FC<{ children: ReactNode; className: string }> = ({ children, className }) => (
  <span className={className}>{children}</span>
);

const UpdatedAt: FC<{ value?: string }> = ({ value }) => value ? (
  <div className="flex items-center gap-2"><CalendarClock size={16} className="text-slate-400" /><span>{new Date(value).toLocaleDateString("id-ID")}</span></div>
) : <span className="text-slate-400">-</span>;

const CategoryActions: FC<CategoryActionProps> = (props) => {
  const user = useAuthStore((state) => state.user);
  if (props.category.tenantId === null) return <ReadonlyLabel text="Default sistem" />;
  if (user && props.category.tenantId !== user.id) return <ReadonlyLabel text="Hanya-Baca" />;
  return <div className="flex items-center justify-end gap-2"><ActionButton label="Edit kategori" onClick={() => props.onEdit(props.category)}><Pencil size={16} /></ActionButton><ActionButton danger disabled={props.deletingId === props.category.id} label="Hapus kategori" onClick={() => props.onDelete(props.category)}><Trash2 size={16} /></ActionButton></div>;
};

const ReadonlyLabel: FC<{ text: string }> = ({ text }) => <span className="text-xs font-semibold text-slate-400">{text}</span>;

const ActionButton: FC<{ children: ReactNode; danger?: boolean; disabled?: boolean; label: string; onClick: () => void }> = (props) => (
  <button type="button" onClick={props.onClick} disabled={props.disabled} className={props.danger ? deleteButtonClass : editButtonClass} title={props.label} aria-label={props.label}>{props.children}</button>
);

const systemBadgeClass = "rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300";
const sharedBadgeClass = "rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
const editButtonClass = "flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-900/50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400";
const deleteButtonClass = "flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900/50 dark:hover:bg-red-900/20 dark:hover:text-red-400";
