import type { FC } from "react";
import type { Order } from "@/types";
import { Star, MessageCircle } from "lucide-react";

interface SubmittedReviewCardProps {
  order: Order;
}

export const SubmittedReviewCard: FC<SubmittedReviewCardProps> = ({ order }) => {
  const review = order.review;
  if (!review) return null;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{order.property?.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Pesanan #{order.order_number}</p>
        </div>
        <div className="flex text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={18} className={i < review.rating ? "fill-current" : "text-slate-200 dark:text-slate-700"} />
          ))}
        </div>
      </div>

      <div className="mb-2 text-sm text-slate-500 dark:text-slate-400">
        Ditulis pada {new Date(review.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
      </div>
      <p className="text-slate-700 dark:text-slate-300 italic">"{review.comment}"</p>

      {review.replies && review.replies.length > 0 && (
        <div className="mt-6 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <MessageCircle size={16} /> Balasan dari {order.property?.name}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{review.replies[0].reply_text}</p>
          <div className="mt-2 text-xs text-slate-400">
            {new Date(review.replies[0].created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
      )}
    </div>
  );
};
