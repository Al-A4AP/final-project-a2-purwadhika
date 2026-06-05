import type { FC } from "react";
import type { Order } from "@/types";
import { Calendar, MapPin } from "lucide-react";

interface EligibleReviewCardProps {
  order: Order;
  onWriteReview: (orderId: string) => void;
}

export const EligibleReviewCard: FC<EligibleReviewCardProps> = ({ order, onWriteReview }) => {
  const checkIn = new Date(order.check_in_date);
  const checkOut = new Date(order.check_out_date);

  return (
    <div className="flex flex-col md:flex-row gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-slate-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="h-32 w-full md:w-48 shrink-0 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
        {order.property?.featured_image_url ? (
          <img src={order.property.featured_image_url} alt={order.property.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <MapPin size={32} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{order.property?.name}</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{order.room?.room_type}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1">
              <Calendar size={14} className="text-slate-400" />
              <span>{checkIn.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} - {checkOut.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-slate-400" />
              <span>{order.property?.city}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex md:justify-end">
          <button 
            onClick={() => onWriteReview(order.id)}
            className="w-full md:w-auto rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600"
          >
            Tulis Ulasan
          </button>
        </div>
      </div>
    </div>
  );
};
