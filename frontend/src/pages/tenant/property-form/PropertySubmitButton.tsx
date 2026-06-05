import type { FC } from "react";
import { Loader2, Save } from "lucide-react";

export const PropertySubmitButton: FC<{ isSubmitting: boolean }> = ({ isSubmitting }) => (
  <div className="sticky bottom-4 z-10 md:static md:bottom-auto">
    <div className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-lg backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none md:dark:bg-transparent md:border-transparent md:dark:border-transparent">
      <button 
        type="submit" 
        disabled={isSubmitting} 
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        {isSubmitting ? (
          <><Loader2 size={18} className="animate-spin" /> Menyimpan Data...</>
        ) : (
          <><Save size={18} /> Simpan Properti</>
        )}
      </button>
    </div>
  </div>
);
