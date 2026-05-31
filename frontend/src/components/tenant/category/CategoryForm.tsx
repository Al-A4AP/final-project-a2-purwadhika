import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import type { PropertyCategory } from '@/types';

interface CategoryFormProps {
  editing?: PropertyCategory | null;
  saving: boolean;
  onSubmit: (name: string) => Promise<void> | void;
  onCancel: () => void;
}

const inputClass = 'w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-red-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white';

export const CategoryForm: FC<CategoryFormProps> = ({ editing, saving, onSubmit, onCancel }) => {
  const [name, setName] = useState(editing?.name || '');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(name);
    if (!editing) setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-lg border bg-white p-4 dark:border-slate-700 dark:bg-slate-800 md:grid-cols-[1fr_auto]">
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama kategori" className={inputClass} disabled={saving} />
      <div className="flex gap-2">
        {editing && <button type="button" onClick={onCancel} className="flex h-11 w-11 items-center justify-center rounded-lg border text-gray-600 dark:border-slate-700 dark:text-gray-300"><X size={18} /></button>}
        <button type="submit" disabled={saving} className="flex h-11 min-w-32 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">
          {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
          {editing ? 'Simpan' : 'Tambah'}
        </button>
      </div>
    </form>
  );
};
