import type { FC } from "react";
import { MessageSquare } from "lucide-react";

export const ReviewsHeader: FC = () => (
  <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
    <ReviewsHeaderCopy />
    <ReputationBadge />
  </div>
);

const ReviewsHeaderCopy = () => (
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Ulasan Tamu</h1>
    <p className="mt-2 text-slate-600 dark:text-slate-400">Kelola umpan balik tamu dan perkuat reputasi properti Anda dengan balasan yang profesional.</p>
  </div>
);

const ReputationBadge = () => (
  <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-slate-100 bg-white px-5 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <MessageSquare size={18} className="text-slate-500" />
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pusat Reputasi</span>
  </div>
);
