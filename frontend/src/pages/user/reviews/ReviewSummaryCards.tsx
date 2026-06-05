import type { FC } from "react";
import { MessageSquareQuote, Star, CheckCircle } from "lucide-react";

interface ReviewSummaryCardsProps {
  totalReviews: number;
  eligibleCount: number;
  averageRating: number;
}

export const ReviewSummaryCards: FC<ReviewSummaryCardsProps> = ({ totalReviews, eligibleCount, averageRating }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <MessageSquareQuote size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Ulasan Ditulis</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalReviews}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Menunggu Ulasan</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{eligibleCount}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <Star size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Rata-Rata Rating</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{averageRating.toFixed(1)} / 5</p>
          </div>
        </div>
      </div>
    </div>
  );
};
