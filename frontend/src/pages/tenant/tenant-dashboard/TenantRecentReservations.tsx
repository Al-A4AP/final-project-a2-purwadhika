import type { FC } from "react";
import { Link } from "react-router-dom";
import type { RecentOrder } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import { ChevronRight, CalendarDays, User } from "lucide-react";

interface TenantRecentReservationsProps {
  orders?: RecentOrder[];
}

export const TenantRecentReservations: FC<TenantRecentReservationsProps> = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CalendarDays size={32} className="mx-auto mb-3 text-slate-400 dark:text-slate-500" />
        <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Belum Ada Reservasi</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Reservasi terbaru Anda akan muncul di sini.</p>
        <Link 
          to="/tenant/properties" 
          className="inline-flex rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900"
        >
          Kelola Properti
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 bg-slate-50/50 p-6 flex items-center justify-between dark:border-slate-800 dark:bg-slate-900/50">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Reservasi Terbaru</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Pantau pesanan yang baru masuk</p>
        </div>
        <Link 
          to="/tenant/orders" 
          className="flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Lihat Semua <ChevronRight size={16} />
        </Link>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {orders.map((order) => (
          <div key={order.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white">{order.property.name}</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {order.room.room_type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <User size={14} />
                <span>{order.user.name}</span>
                <span>•</span>
                <span>{new Date(order.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3">
              <div className="text-left md:text-right">
                <div className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(order.total_price)}</div>
                <div className={`text-xs font-semibold mt-0.5 ${
                  order.status === 'WAITING_PAYMENT' ? 'text-amber-600 dark:text-amber-400' :
                  order.status === 'WAITING_CONFIRMATION' ? 'text-blue-600 dark:text-blue-400' :
                  order.status === 'PROCESSED' ? 'text-indigo-600 dark:text-indigo-400' :
                  order.status === 'COMPLETED' ? 'text-emerald-600 dark:text-emerald-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {order.status.replace('_', ' ')}
                </div>
              </div>
              <Link 
                to={`/tenant/orders?search=${order.id}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
