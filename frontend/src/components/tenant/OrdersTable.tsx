import type { FC } from "react";
import type { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/formatters";
import { Check, X, ExternalLink } from "lucide-react";
import { OrderMobileCard } from "./OrderMobileCard";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrdersTableProps {
  orders: Order[];
  updating: string | null;
  handleUpdateStatus: (id: string, status: string) => void;
}

export const OrdersTable: FC<OrdersTableProps> = ({ orders, updating, handleUpdateStatus }) => {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">Belum ada pesanan masuk.</p>
        ) : (
          orders.map((order) => (
            <OrderMobileCard key={order.id} order={order} updating={updating} handleUpdateStatus={handleUpdateStatus} />
          ))
        )}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-300">
          <tr>
            <th className="px-6 py-4">Order ID & Tamu</th>
            <th className="px-6 py-4">Properti & Kamar</th>
            <th className="px-6 py-4">Check In/Out</th>
            <th className="px-6 py-4">Total & Metode</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center">
                Belum ada pesanan masuk.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr
                key={order.id}
                className="border-b dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {order.order_number}
                  </p>
                  <p className="text-xs">{order.user?.name}</p>
                  <p className="text-xs">{order.user?.email}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {order.property?.name}
                  </p>
                  <p className="text-xs">{order.room?.room_type}</p>
                </td>
                <td className="px-6 py-4">
                  <p>{formatDate(order.check_in_date)}</p>
                  <p>{formatDate(order.check_out_date)}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatPrice(order.total_price)}
                  </p>
                  <p className="text-xs">{order.payment_method}</p>
                </td>
                <td className="px-6 py-4">
                  <OrderStatusBadge status={order.status} />
                  {order.payment_proof_url && (
                    <a
                      href={order.payment_proof_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                      aria-label={`Lihat bukti bayar ${order.order_number}`}
                    >
                      Lihat Bukti <ExternalLink size={12} />
                    </a>
                  )}
                </td>
                <td className="px-6 py-4">
                  {order.status === "WAITING_CONFIRMATION" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(order.id, "PROCESSED")}
                        disabled={updating === order.id}
                        className="flex h-9 w-9 items-center justify-center rounded bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-50"
                        title="Terima"
                        aria-label={`Terima pesanan ${order.order_number}`}
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                        disabled={updating === order.id}
                        className="flex h-9 w-9 items-center justify-center rounded bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                        title="Tolak"
                        aria-label={`Tolak pesanan ${order.order_number}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {order.status === "WAITING_PAYMENT" &&
                    order.payment_method === "MANUAL" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                        disabled={updating === order.id}
                        className="text-xs text-red-600 hover:underline"
                        title="Batalkan pesanan manual"
                        aria-label={`Batalkan pesanan ${order.order_number}`}
                      >
                        Batalkan Pesanan
                      </button>
                    )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </>
  );
};
