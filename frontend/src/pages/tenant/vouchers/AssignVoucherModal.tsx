import type { FC, FormEvent } from "react";
import { useState, useEffect } from "react";
import { Loader2, Send } from "lucide-react";
import { Modal } from "@/components/common/Modal";
import type { Voucher } from "@/types";

interface AssignVoucherModalProps {
  voucher: Voucher | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void> | void;
}

export const AssignVoucherModal: FC<AssignVoucherModalProps> = ({ voucher, saving, onClose, onSubmit }) => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (voucher) {
      Promise.resolve().then(() => setEmail(""));
    }
  }, [voucher]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(email);
  };

  return (
    <Modal
      isOpen={!!voucher}
      onClose={onClose}
      title="Kirim Voucher ke Pelanggan"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400">
            <Send size={32} />
          </div>
        </div>

        <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Masukkan email pengguna yang terdaftar untuk mengirimkan voucher <strong>{voucher?.code}</strong>.
        </p>

        <div className="mb-8 space-y-1">
          <label htmlFor="userEmail" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Email Pelanggan <span className="text-red-500">*</span>
          </label>
          <input
            id="userEmail"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={saving}
            placeholder="Contoh: user@example.com"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
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
            disabled={saving || !email.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            Kirim Voucher
          </button>
        </div>
      </form>
    </Modal>
  );
};
