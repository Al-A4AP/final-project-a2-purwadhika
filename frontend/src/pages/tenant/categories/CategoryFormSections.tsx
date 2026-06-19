import type { Dispatch, FC, SetStateAction } from "react";
import { Loader2, Tags } from "lucide-react";
import { CATEGORY_DESCRIPTION_MAX_LENGTH } from "@/constants/validation";

type RentalType = "PER_ROOM" | "WHOLE_PROPERTY";

interface CategoryFormValues {
  description: string;
  name: string;
  rentalType: RentalType;
  setDescription: Dispatch<SetStateAction<string>>;
  setName: Dispatch<SetStateAction<string>>;
  setRentalType: Dispatch<SetStateAction<RentalType>>;
}

const INPUT_CLASS = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white";
const LABEL_CLASS = "block text-sm font-semibold text-slate-700 dark:text-slate-300";

export const CategoryFormIcon: FC = () => (
  <div className="mb-6 flex items-center justify-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
      <Tags size={32} />
    </div>
  </div>
);

export const CategoryFormFields: FC<{ form: CategoryFormValues; saving: boolean }> = ({ form, saving }) => (
  <>
    <CategoryNameField name={form.name} saving={saving} setName={form.setName} />
    <CategoryDescriptionField description={form.description} saving={saving} setDescription={form.setDescription} />
    <CategoryRentalTypeField rentalType={form.rentalType} saving={saving} setRentalType={form.setRentalType} />
  </>
);

const CategoryNameField: FC<Pick<CategoryFormValues, "name" | "setName"> & { saving: boolean }> = ({ name, saving, setName }) => (
  <div className="mb-6 space-y-1">
    <label htmlFor="categoryName" className={LABEL_CLASS}>Nama Kategori <span className="text-red-500">*</span></label>
    <input id="categoryName" type="text" required value={name} onChange={(event) => setName(event.target.value)} disabled={saving} maxLength={20} placeholder="Contoh: Villa, Apartemen, Glamping" className={INPUT_CLASS} />
    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Gunakan nama yang singkat dan deskriptif untuk filter pencarian.</p>
  </div>
);

const CategoryDescriptionField: FC<Pick<CategoryFormValues, "description" | "setDescription"> & { saving: boolean }> = ({ description, saving, setDescription }) => (
  <div className="mb-6 space-y-1">
    <label htmlFor="categoryDescription" className={LABEL_CLASS}>Deskripsi Kategori</label>
    <textarea id="categoryDescription" value={description} onChange={(event) => setDescription(event.target.value)} disabled={saving} maxLength={CATEGORY_DESCRIPTION_MAX_LENGTH} placeholder="Opsional: Deskripsi tambahan" className={INPUT_CLASS} rows={3} />
    <p className="text-xs text-slate-500 dark:text-slate-400">{description.trim().length}/{CATEGORY_DESCRIPTION_MAX_LENGTH} karakter</p>
  </div>
);

const CategoryRentalTypeField: FC<Pick<CategoryFormValues, "rentalType" | "setRentalType"> & { saving: boolean }> = ({ rentalType, saving, setRentalType }) => (
  <div className="mb-8 space-y-1">
    <label htmlFor="categoryRentalType" className={LABEL_CLASS}>Mode Sewa Default <span className="text-red-500">*</span></label>
    <select id="categoryRentalType" value={rentalType} onChange={(event) => setRentalType(event.target.value as RentalType)} disabled={saving} className={INPUT_CLASS}>
      <option value="PER_ROOM">Sewa Kamar</option>
      <option value="WHOLE_PROPERTY">Sewa Seluruh Properti</option>
    </select>
  </div>
);

export const CategoryFormActions: FC<{ editing: boolean; name: string; onClose: () => void; saving: boolean }> = ({ editing, name, onClose, saving }) => (
  <div className="flex gap-3">
    <button type="button" onClick={onClose} disabled={saving} className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">Batal</button>
    <button type="submit" disabled={saving || !name.trim()} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
      {saving ? <Loader2 size={16} className="animate-spin" /> : null}
      {editing ? "Simpan Perubahan" : "Tambahkan"}
    </button>
  </div>
);
