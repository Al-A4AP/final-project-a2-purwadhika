import type { FC } from "react";
import { Loader2, Tags } from "lucide-react";
import { Modal } from "@/components/common/Modal";
import type { PropertyCategory } from "@/types";
import { useCategoryForm } from "@/hooks/tenant/categories/useCategoryForm";

interface CategoryFormModalProps {
  isOpen: boolean;
  editing: PropertyCategory | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string; default_rental_type?: string }) => Promise<void> | void;
}

export const CategoryFormModal: FC<CategoryFormModalProps> = ({ isOpen, editing, saving, onClose, onSubmit }) => {
  const {
    name, setName, description, setDescription, rentalType, setRentalType, handleSubmit
  } = useCategoryForm({ isOpen, editing, onSubmit });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editing ? "Edit Kategori" : "Tambah Kategori Baru"}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <Tags size={32} />
          </div>
        </div>

        <div className="mb-6 space-y-1">
          <label htmlFor="categoryName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Nama Kategori <span className="text-red-500">*</span>
          </label>
          <input
            id="categoryName"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
            placeholder="Contoh: Villa, Apartemen, Glamping"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gunakan nama yang singkat dan deskriptif untuk filter pencarian.
          </p>
        </div>

        <div className="mb-6 space-y-1">
          <label htmlFor="categoryDescription" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Deskripsi Kategori
          </label>
          <textarea
            id="categoryDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={saving}
            placeholder="Opsional: Deskripsi tambahan"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            rows={3}
          />
        </div>

        <div className="mb-8 space-y-1">
          <label htmlFor="categoryRentalType" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Mode Sewa Default <span className="text-red-500">*</span>
          </label>
          <select
            id="categoryRentalType"
            value={rentalType}
            onChange={(e) => setRentalType(e.target.value as "PER_ROOM" | "WHOLE_PROPERTY")}
            disabled={saving}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="PER_ROOM">Sewa Kamar</option>
            <option value="WHOLE_PROPERTY">Sewa Seluruh Properti</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            {editing ? "Simpan Perubahan" : "Tambahkan"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
