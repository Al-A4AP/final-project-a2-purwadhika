import type { FC } from "react";
import { Tags } from "lucide-react";

interface CategoriesSummaryProps {
  categoryLimit: number;
  owned: number;
  total: number;
}

export const CategoriesSummary: FC<CategoriesSummaryProps> = ({ categoryLimit, owned, total }) => (
  <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <SummaryCard label="Total Kategori Bersama" value={total} />
    <SummaryCard label="Kategori Milik Anda" value={`${owned}/${categoryLimit}`} />
  </div>
);

const SummaryCard: FC<{ label: string; value: number | string }> = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"><Tags size={24} /></div>
      <div><p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p><p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p></div>
    </div>
  </div>
);
