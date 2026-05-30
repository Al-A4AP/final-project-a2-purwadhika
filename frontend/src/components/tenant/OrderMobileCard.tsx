import type { FC } from 'react';
import { Check, ExternalLink, X } from 'lucide-react';
import type { Order } from '@/types';
import { formatDate, formatPrice } from '@/lib/formatters';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderMobileCardProps {
  order: Order;
  updating: string | null;
  handleUpdateStatus: (id: string, status: string) => void;
}

const Field: FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div>
    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
    <p className="text-sm text-gray-700 dark:text-gray-200">{value || '-'}</p>
  </div>
);

const ReviewActions: FC<OrderMobileCardProps> = ({ order, updating, handleUpdateStatus }) => (
  <div className="grid grid-cols-2 gap-2">
    <button onClick={() => handleUpdateStatus(order.id, 'PROCESSED')} disabled={updating === order.id}
      className="flex h-10 items-center justify-center gap-2 rounded-lg bg-green-50 text-sm font-medium text-green-700 disabled:opacity-50">
      <Check size={16} /> Terima
    </button>
    <button onClick={() => handleUpdateStatus(order.id, 'CANCELLED')} disabled={updating === order.id}
      className="flex h-10 items-center justify-center gap-2 rounded-lg bg-red-50 text-sm font-medium text-red-700 disabled:opacity-50">
      <X size={16} /> Tolak
    </button>
  </div>
);

const ManualCancel: FC<OrderMobileCardProps> = ({ order, updating, handleUpdateStatus }) => (
  <button onClick={() => handleUpdateStatus(order.id, 'CANCELLED')} disabled={updating === order.id}
    className="h-10 rounded-lg border border-red-200 text-sm font-medium text-red-600 disabled:opacity-50">
    Batalkan Pesanan
  </button>
);

export const OrderMobileCard: FC<OrderMobileCardProps> = ({ order, updating, handleUpdateStatus }) => (
  <article className="rounded-xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate font-semibold text-gray-900 dark:text-white">{order.order_number}</p>
        <p className="truncate text-xs text-gray-500">{order.user?.name} - {order.user?.email}</p>
      </div>
      <OrderStatusBadge status={order.status} />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <Field label="Properti" value={order.property?.name} />
      <Field label="Kamar" value={order.room?.room_type} />
      <Field label="Check-in" value={formatDate(order.check_in_date)} />
      <Field label="Check-out" value={formatDate(order.check_out_date)} />
      <Field label="Total" value={formatPrice(order.total_price)} />
      <Field label="Metode" value={order.payment_method} />
    </div>
    {order.payment_proof_url && (
      <a href={order.payment_proof_url} target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-1 text-sm text-blue-600">
        Lihat Bukti <ExternalLink size={13} />
      </a>
    )}
    {order.status === 'WAITING_CONFIRMATION' && <div className="mt-4"><ReviewActions order={order} updating={updating} handleUpdateStatus={handleUpdateStatus} /></div>}
    {order.status === 'WAITING_PAYMENT' && order.payment_method === 'MANUAL' && <div className="mt-4"><ManualCancel order={order} updating={updating} handleUpdateStatus={handleUpdateStatus} /></div>}
  </article>
);
