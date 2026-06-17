import type { FC } from "react";
import { CheckCircle, MessageSquareQuote, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ReviewSummaryCardsProps {
  totalReviews: number;
  eligibleCount: number;
  averageRating: number;
}

interface SummaryCardItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClass: string;
}

export const ReviewSummaryCards: FC<ReviewSummaryCardsProps> = (props) => (
  <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
    {getSummaryCards(props).map((item) => <SummaryCard key={item.label} item={item} />)}
  </div>
);

const SummaryCard: FC<{ item: SummaryCardItem }> = ({ item }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.iconClass}`}>
        <item.icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
      </div>
    </div>
  </div>
);

const getSummaryCards = ({
  totalReviews,
  eligibleCount,
  averageRating,
}: ReviewSummaryCardsProps): SummaryCardItem[] => [
  card("Ulasan Ditulis", totalReviews, MessageSquareQuote, "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"),
  card("Menunggu Ulasan", eligibleCount, CheckCircle, "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"),
  card("Rata-Rata Rating", `${averageRating.toFixed(1)} / 5`, Star, "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"),
];

const card = (
  label: string,
  value: string | number,
  icon: LucideIcon,
  iconClass: string,
): SummaryCardItem => ({ label, value, icon, iconClass });
