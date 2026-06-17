import type { FC } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Order } from "@/types";

export const ReviewRemindersHeader: FC<{ showAllLink: boolean }> = ({
  showAllLink,
}) => (
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Menunggu Ulasan Anda!</h2>
    {showAllLink && (
      <Link
        to="/reviews"
        className="text-sm font-semibold text-red-600 transition hover:text-red-700 dark:text-red-500"
      >
        Lihat Semua -&gt;
      </Link>
    )}
  </div>
);

export const ReviewReminderCard: FC<{ order: Order }> = ({ order }) => (
  <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm dark:border-amber-900/50 dark:bg-amber-900/10 md:flex-row">
    <ReviewReminderCopy order={order} />
    <Link
      to="/reviews"
      className="w-full whitespace-nowrap rounded-xl bg-amber-500 px-6 py-3 text-center font-bold text-white transition hover:bg-amber-600 md:w-auto"
    >
      Beri Ulasan
    </Link>
  </div>
);

const ReviewReminderCopy: FC<{ order: Order }> = ({ order }) => (
  <div className="flex items-start gap-4">
    <div className="rounded-full bg-amber-100 p-3 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500">
      <Star size={24} />
    </div>
    <div>
      <h3 className="font-bold text-slate-900 dark:text-white">Bagaimana pengalaman menginap Anda?</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Anda telah menyelesaikan reservasi di{" "}
        <span className="font-semibold">{order.property?.name}</span>.
        Berikan ulasan untuk membantu tamu lainnya!
      </p>
    </div>
  </div>
);
