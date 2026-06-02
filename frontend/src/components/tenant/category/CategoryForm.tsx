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

const useCategoryForm = (editing: PropertyCategory | null | undefined, onSubmit: CategoryFormProps['onSubmit']) => {
  const [name, setName] = useState(editing?.name || '');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(name);
    if (!editing) setName('');
  };

  return { handleSubmit, name, setName };
};

const CategoryNameInput: FC<{ name: string; saving: boolean; onNameChange: (value: string) => void }> = ({ name, saving, onNameChange }) => (
  <input value={name} onChange={(event) => onNameChange(event.target.value)} placeholder="Nama kategori" className={inputClass} disabled={saving} />
);

const CancelButton: FC<{ onCancel: () => void }> = ({ onCancel }) => (
  <button type="button" onClick={onCancel} className="flex h-11 w-11 items-center justify-center rounded-lg border text-gray-600 dark:border-slate-700 dark:text-gray-300" title="Batal edit kategori" aria-label="Batal edit kategori"><X size={18} /></button>
);

const SubmitButton: FC<{ editing: boolean; saving: boolean }> = ({ editing, saving }) => (
  <button type="submit" disabled={saving} className="flex h-11 min-w-32 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60" title={editing ? 'Simpan kategori' : 'Tambah kategori'}>
    {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
    {editing ? 'Simpan' : 'Tambah'}
  </button>
);

const FormActions: FC<Pick<CategoryFormProps, 'editing' | 'saving' | 'onCancel'>> = ({ editing, saving, onCancel }) => (
  <div className="flex gap-2">
    {editing && <CancelButton onCancel={onCancel} />}
    <SubmitButton editing={Boolean(editing)} saving={saving} />
  </div>
);

export const CategoryForm: FC<CategoryFormProps> = ({ editing, saving, onSubmit, onCancel }) => {
  const { handleSubmit, name, setName } = useCategoryForm(editing, onSubmit);

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-lg border bg-white p-4 dark:border-slate-700 dark:bg-slate-800 md:grid-cols-[1fr_auto]">
      <CategoryNameInput name={name} saving={saving} onNameChange={setName} />
      <FormActions editing={editing} saving={saving} onCancel={onCancel} />
    </form>
  );
};
