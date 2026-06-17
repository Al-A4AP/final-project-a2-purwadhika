import type { FC } from "react";
import { Loader2, Save } from "lucide-react";

export const RoomSubmitButton: FC<{ isSubmitting: boolean }> = ({ isSubmitting }) => (
  <div className="mt-8 flex gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
    <button 
      type="submit" 
      disabled={isSubmitting}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
    >
      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
      {isSubmitting ? "Menyimpan..." : "Simpan Data Kamar"}
    </button>
  </div>
);
