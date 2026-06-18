import type { FC, ReactNode } from 'react';
import { Check, ExternalLink, X } from 'lucide-react';
import type { Order } from '@/types';
import { formatDate, formatPrice } from '@/lib/formatters';
import { OrderStatusBadge } from './OrderStatusBadge';
import { getUserRefundStatus } from '@/lib/orderStatus';

interface OrderMobileCardProps {
  order: Order;
  updating: string | null;
  handleUpdateStatus: (id: string, status: string) => void;
  handleMarkRefundComplete: (id: string) => void;
}

export const OrderMobileCard: FC<OrderMobileCardProps> = (props) => (
  <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
    <OrderMobileHeader order={props.order} />
    <OrderMobileFields order={props.order} />
    <PaymentProofLink order={props.order} />
    <OrderMobileActions {...props} />
  </article>
);

const OrderMobileHeader: FC<Pick<OrderMobileCardProps, 'order'>> = ({ order }) => {
  const refundStatus = getUserRefundStatus(order);

  return (
    <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
      <OrderIdentity order={order} />
      <div className="flex shrink-0 flex-col items-end gap-2">
        <OrderStatusBadge status={order.status} />
        {refundStatus === "PENDING" && (
          <span className="inline-flex items-center justify-center rounded-md px-2 py-1 text-center text-[10px] font-medium bg-orange-100 text-orange-800">
            Refund Diperlukan
          </span>
        )}
        {refundStatus === "COMPLETED" && (
          <span className="inline-flex items-center justify-center rounded-md px-2 py-1 text-center text-[10px] font-medium bg-emerald-100 text-emerald-800">
            Refund Selesai
          </span>
        )}
      </div>
    </div>
  );
};

const OrderIdentity: FC<Pick<OrderMobileCardProps, 'order'>> = ({ order }) => (
  <div className="min-w-0">
    <p className="truncate font-bold text-slate-900 dark:text-white">{order.order_number}</p>
    <p className="truncate text-xs text-slate-500 dark:text-slate-400 mt-0.5">{order.user?.name} - {order.user?.email}</p>
  </div>
);

const OrderMobileFields: FC<Pick<OrderMobileCardProps, 'order'>> = ({ order }) => (
  <div className="grid grid-cols-2 gap-y-4 gap-x-2">
    {getOrderFields(order).map((field) => <Field key={field.label} {...field} />)}
  </div>
);

const Field: FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
    <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200 mt-0.5">{value || '-'}</p>
  </div>
);

const PaymentProofLink: FC<Pick<OrderMobileCardProps, 'order'>> = ({ order }) =>
  order.payment_proof_url ? (
    <a href={order.payment_proof_url} target="_blank" rel="noreferrer" className={proofLinkClass} aria-label={`Lihat bukti bayar ${order.order_number}`} title="Lihat bukti bayar">
      Lihat Bukti Pembayaran <ExternalLink size={14} />
    </a>
  ) : null;

const OrderMobileActions: FC<OrderMobileCardProps> = (props) => {
  if (props.order.status === 'WAITING_CONFIRMATION') return <ActionWrap><ReviewActions {...props} /></ActionWrap>;
  if (isManualWaitingPayment(props.order)) return <ActionWrap><ManualCancel {...props} /></ActionWrap>;
  if (getUserRefundStatus(props.order) === "PENDING") return <ActionWrap><RefundComplete {...props} /></ActionWrap>;
  return null;
};

const RefundComplete: FC<OrderMobileCardProps> = (props) => (
  <button onClick={() => props.handleMarkRefundComplete(props.order.id)} disabled={isUpdating(props)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-bold text-orange-600 transition hover:bg-orange-50 disabled:opacity-50 dark:border-orange-900/30 dark:bg-slate-800 dark:hover:bg-orange-900/20" title="Tandai Refund Selesai" aria-label={`Tandai Refund Selesai ${props.order.order_number}`}>
    <Check size={16} /> Tandai Refund Selesai
  </button>
);

const ReviewActions: FC<OrderMobileCardProps> = (props) => (
  <div className="grid grid-cols-2 gap-3">
    <StatusButton {...props} status="PROCESSED" label="Terima" icon={<Check size={16} />} />
    <StatusButton {...props} status="CANCELLED" label="Tolak" icon={<X size={16} />} danger />
  </div>
);

const ManualCancel: FC<OrderMobileCardProps> = (props) => (
  <button onClick={() => props.handleUpdateStatus(props.order.id, 'CANCELLED')} disabled={isUpdating(props)} className={manualCancelClass}
    title="Batalkan pesanan manual" aria-label={`Batalkan pesanan ${props.order.order_number}`}>
    Batalkan Pesanan
  </button>
);

const StatusButton: FC<StatusButtonProps> = (props) => (
  <button onClick={() => props.handleUpdateStatus(props.order.id, props.status)} disabled={isUpdating(props)}
    className={props.danger ? rejectButtonClass : acceptButtonClass} title={`${props.label} pesanan`} aria-label={`${props.label} pesanan ${props.order.order_number}`}>
    {props.icon} {props.label}
  </button>
);

const ActionWrap: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">{children}</div>
);

const getOrderFields = (order: Order) => [
  { label: 'Properti', value: order.property?.name },
  { label: 'Kamar', value: order.room?.room_type },
  { label: 'Check-in', value: formatDate(order.check_in_date) },
  { label: 'Check-out', value: formatDate(order.check_out_date) },
  { label: 'Total', value: formatPrice(order.total_price) },
  { label: 'Metode', value: order.payment_method },
];

const isManualWaitingPayment = (order: Order) =>
  order.status === 'WAITING_PAYMENT' && order.payment_method === 'MANUAL';

const isUpdating = ({ order, updating }: Pick<OrderMobileCardProps, 'order' | 'updating'>) =>
  updating === order.id;

const proofLinkClass = 'mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50/50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100 dark:border-blue-900/40 dark:bg-blue-900/10 dark:hover:bg-blue-900/30';
const manualCancelClass = 'w-full rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/30 dark:bg-slate-800 dark:hover:bg-red-900/20';
const acceptButtonClass = 'flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200';
const rejectButtonClass = 'flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/30 dark:bg-slate-800 dark:hover:bg-red-900/20';

interface StatusButtonProps extends OrderMobileCardProps {
  status: string;
  label: string;
  icon: ReactNode;
  danger?: boolean;
}
