import type { FC } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import type { Order } from "@/types";

export const DashboardRecentHeader: FC = () => (
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Riwayat Reservasi</h2>
    <Link to="/orders" className="text-sm font-semibold text-red-600 transition hover:text-red-700 dark:text-red-500">
      Lihat Semua
    </Link>
  </div>
);

export const DashboardRecentRow: FC<{ order: Order }> = ({ order }) => (
  <Link to={`/orders/${order.id}`} className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 md:flex-row md:items-center">
    <RecentOrderInfo order={order} />
    <RecentOrderAmount order={order} />
  </Link>
);

const RecentOrderInfo: FC<{ order: Order }> = ({ order }) => (
  <div className="mb-3 md:mb-0">
    <h3 className="font-bold text-slate-900 dark:text-white">{order.property?.name}</h3>
    <p className="text-sm text-slate-500">{formatRange(order)}</p>
  </div>
);

const RecentOrderAmount: FC<{ order: Order }> = ({ order }) => (
  <div className="flex items-center justify-between gap-6 md:justify-end">
    <div className="text-left md:text-right">
      <p className="font-bold text-slate-900 dark:text-white">{formatPrice(order.total_price)}</p>
      <p className="text-xs font-medium uppercase text-slate-500">{order.status}</p>
    </div>
    <ChevronRight className="text-slate-300" />
  </div>
);

const formatRange = (order: Order) =>
  `${formatShortDate(order.check_in_date)} - ${formatLongDate(order.check_out_date)}`;

const formatShortDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short" });

const formatLongDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
