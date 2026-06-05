import type { FC, FormEvent } from "react";
import { useState, useEffect } from "react";
import { Loader2, Tags } from "lucide-react";
import { Modal } from "@/components/common/Modal";
import type { PropertyCategory } from "@/types";

interface CategoryFormModalProps {
  isOpen: boolean;
  editing: PropertyCategory | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void> | void;
}

export const CategoryFormModal: FC<CategoryFormModalProps> = ({ isOpen, editing, saving, onClose, onSubmit }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) {
      Promise.resolve().then(() => setName(editing?.name || ""));
    }
  }, [isOpen, editing]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(name);
  };

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
