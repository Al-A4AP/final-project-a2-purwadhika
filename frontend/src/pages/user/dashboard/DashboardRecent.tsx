import type { FC } from "react";
import { Link } from "react-router-dom";
import type { Order } from "@/types";
import { ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/formatters";

interface DashboardRecentProps {
  orders: Order[];
}

export const DashboardRecent: FC<DashboardRecentProps> = ({ orders }) => {
  if (orders.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Reservasi Terakhir</h2>
        <Link to="/orders" className="text-sm font-semibold text-red-600 transition hover:text-red-700 dark:text-red-500">
          Lihat Semua
        </Link>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} to={`/orders/${order.id}`} className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 md:flex-row md:items-center">
            <div className="mb-3 md:mb-0">
              <h3 className="font-bold text-slate-900 dark:text-white">{order.property?.name}</h3>
              <p className="text-sm text-slate-500">{new Date(order.check_in_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })} - {new Date(order.check_out_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
            <div className="flex items-center justify-between gap-6 md:justify-end">
              <div className="text-left md:text-right">
                <p className="font-bold text-slate-900 dark:text-white">{formatPrice(order.total_price)}</p>
                <p className="text-xs font-medium uppercase text-slate-500">{order.status}</p>
              </div>
              <ChevronRight className="text-slate-300" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
