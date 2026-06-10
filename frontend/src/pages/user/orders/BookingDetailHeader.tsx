import type { FC } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import type { Order } from "@/types";
import { UserOrderStatusBadge } from "./UserOrderStatusBadge";
import { getUserRefundStatus } from "@/lib/orderStatus";

export const BookingDetailHeader: FC<{ order: Order }> = ({ order }) => {
  return (
    <div className="mb-8">
      <Link to="/orders" className="mb-6 inline-flex items-center text-sm font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
        <ChevronLeft className="mr-1 h-4 w-4" /> Kembali ke Riwayat
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Detail Reservasi</h1>
          <div className="flex items-center gap-3">
            <p className="font-mono text-sm font-semibold text-slate-500">#{order.order_number}</p>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <p className="text-sm text-slate-500">Dibuat pada {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <UserOrderStatusBadge status={order.status} />
          {getUserRefundStatus(order) === "PENDING" && (
            <span className="inline-flex items-center justify-center gap-1 rounded-md bg-orange-100 px-2 py-1 text-center text-xs font-medium text-orange-800">Menunggu Refund Manual</span>
          )}
          {getUserRefundStatus(order) === "COMPLETED" && (
            <span className="inline-flex items-center justify-center gap-1 rounded-md bg-emerald-100 px-2 py-1 text-center text-xs font-medium text-emerald-800">Refund Selesai</span>
          )}
        </div>
      </div>
    </div>
  );
};
