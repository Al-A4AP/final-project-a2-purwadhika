import type { FC, ReactNode } from "react";
import { Building2, Star, Tags } from "lucide-react";
import type { ReviewRatingSummaryItem, TenantReviewSummary } from "@/types";

export const TenantReviewRatingSummary: FC<{ summary: TenantReviewSummary }> = ({ summary }) => (
  <section className="grid gap-4 lg:grid-cols-2">
    <SummaryPanel icon={<Tags size={18} />} items={summary.byCategory} title="Rating Per Kategori" />
    <SummaryPanel icon={<Building2 size={18} />} items={summary.byProperty} title="Rating Per Properti" />
  </section>
);

const SummaryPanel: FC<SummaryPanelProps> = ({ icon, items, title }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="mb-4 flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">{icon}</div>
      <h2 className="font-bold text-slate-900 dark:text-white">{title}</h2>
    </div>
    {items.length ? <SummaryList items={items.slice(0, 5)} /> : <EmptySummary />}
  </div>
);

const SummaryList: FC<{ items: ReviewRatingSummaryItem[] }> = ({ items }) => (
  <div className="space-y-3">
    {items.map((item) => <SummaryRow item={item} key={item.id} />)}
  </div>
);

const SummaryRow: FC<{ item: ReviewRatingSummaryItem }> = ({ item }) => (
  <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{item.totalReviews} ulasan</p>
    </div>
    <div className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-bold text-amber-600 shadow-sm dark:bg-slate-900 dark:text-amber-300">
      <Star size={14} fill="currentColor" />
      {item.averageRating.toFixed(1)}
    </div>
  </div>
);

const EmptySummary: FC = () => (
  <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
    Belum ada ulasan untuk dihitung.
  </p>
);

interface SummaryPanelProps {
  icon: ReactNode;
  items: ReviewRatingSummaryItem[];
  title: string;
}
