import type { FC } from "react";
import type { Order } from "@/types";
import { Calendar, MapPin } from "lucide-react";

interface EligibleReviewCardProps {
  order: Order;
  onWriteReview: (orderId: string) => void;
}

export const EligibleReviewCard: FC<EligibleReviewCardProps> = ({
  order,
  onWriteReview,
}) => (
  <div className="flex flex-col gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-slate-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 md:flex-row">
    <ReviewPropertyImage order={order} />
    <div className="flex flex-1 flex-col justify-between">
      <ReviewPropertyInfo order={order} />
      <WriteReviewButton orderId={order.id} onWriteReview={onWriteReview} />
    </div>
  </div>
);

const ReviewPropertyImage: FC<{ order: Order }> = ({ order }) => (
  <div className="h-32 w-full shrink-0 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 md:w-48">
    {order.property?.featured_image_url ? (
      <img src={order.property.featured_image_url} alt={order.property.name} className="h-full w-full object-cover" />
    ) : (
      <div className="flex h-full w-full items-center justify-center text-slate-400"><MapPin size={32} /></div>
    )}
  </div>
);

const ReviewPropertyInfo: FC<{ order: Order }> = ({ order }) => (
  <div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{order.property?.name}</h3>
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{order.room?.room_type}</p>
    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
      <ReviewDateRange order={order} />
      <ReviewCity city={order.property?.city} />
    </div>
  </div>
);

const ReviewDateRange: FC<{ order: Order }> = ({ order }) => (
  <div className="flex items-center gap-1">
    <Calendar size={14} className="text-slate-400" />
    <span>{formatReviewDate(order.check_in_date)} - {formatReviewDate(order.check_out_date)}</span>
  </div>
);

const ReviewCity: FC<{ city?: string }> = ({ city }) => (
  <div className="flex items-center gap-1">
    <MapPin size={14} className="text-slate-400" />
    <span>{city}</span>
  </div>
);

const WriteReviewButton: FC<{
  orderId: string;
  onWriteReview: (orderId: string) => void;
}> = ({
  orderId,
  onWriteReview,
}) => (
  <div className="mt-4 flex md:justify-end">
    <button onClick={() => onWriteReview(orderId)} className="w-full rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600 md:w-auto">Tulis Ulasan</button>
  </div>
);

const formatReviewDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
