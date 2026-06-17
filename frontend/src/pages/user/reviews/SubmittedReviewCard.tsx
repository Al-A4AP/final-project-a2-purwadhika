import type { FC } from "react";
import type { Order, Review } from "@/types";
import { MessageCircle, Star } from "lucide-react";

interface SubmittedReviewCardProps {
  order: Order;
}

export const SubmittedReviewCard: FC<SubmittedReviewCardProps> = ({ order }) => {
  const review = order.review;
  if (!review) return null;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <SubmittedReviewHeader order={order} review={review} />
      <SubmittedReviewContent review={review} />
      <SubmittedReviewReply order={order} review={review} />
    </div>
  );
};

const SubmittedReviewHeader: FC<{ order: Order; review: Review }> = ({
  order,
  review,
}) => (
  <div className="mb-4 flex items-start justify-between">
    <div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{order.property?.name}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">Pesanan #{order.order_number}</p>
    </div>
    <ReviewStars rating={review.rating} />
  </div>
);

const SubmittedReviewContent: FC<{ review: Review }> = ({ review }) => (
  <>
    <div className="mb-2 text-sm text-slate-500 dark:text-slate-400">Ditulis pada {formatLongDate(review.created_at)}</div>
    <p className="italic text-slate-700 dark:text-slate-300">"{review.comment}"</p>
  </>
);

const SubmittedReviewReply: FC<{ order: Order; review: Review }> = ({
  order,
  review,
}) => {
  const reply = review.replies?.[0];
  if (!reply) return null;
  return (
    <div className="mt-6 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"><MessageCircle size={16} /> Balasan dari {order.property?.name}</div>
      <p className="text-sm text-slate-600 dark:text-slate-400">{reply.reply_text}</p>
      <div className="mt-2 text-xs text-slate-400">{formatLongDate(reply.created_at)}</div>
    </div>
  );
};

const ReviewStars: FC<{ rating: number }> = ({ rating }) => (
  <div className="flex text-amber-500">
    {Array.from({ length: 5 }).map((_, index) => (
      <Star key={index} size={18} className={index < rating ? "fill-current" : "text-slate-200 dark:text-slate-700"} />
    ))}
  </div>
);

const formatLongDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
