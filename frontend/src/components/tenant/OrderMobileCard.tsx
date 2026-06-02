import type { FC, ReactNode } from 'react';
import { Check, ExternalLink, X } from 'lucide-react';
import type { Order } from '@/types';
import { formatDate, formatPrice } from '@/lib/formatters';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderMobileCardProps {
  order: Order;
  updating: string | null;
  handleUpdateStatus: (id: string, status: string) => void;
}

export const OrderMobileCard: FC<OrderMobileCardProps> = (props) => (
  <article className="rounded-2xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <OrderMobileHeader order={props.order} />
    <OrderMobileFields order={props.order} />
    <PaymentProofLink order={props.order} />
    <OrderMobileActions {...props} />
  </article>
);

const OrderMobileHeader: FC<Pick<OrderMobileCardProps, 'order'>> = ({ order }) => (
  <div className="mb-4 flex items-start justify-between gap-3">
    <OrderIdentity order={order} />
    <div className="shrink-0"><OrderStatusBadge status={order.status} /></div>
  </div>
);

const OrderIdentity: FC<Pick<OrderMobileCardProps, 'order'>> = ({ order }) => (
  <div className="min-w-0">
    <p className="truncate font-semibold text-gray-900 dark:text-white">{order.order_number}</p>
    <p className="truncate text-xs text-gray-500">{order.user?.name} - {order.user?.email}</p>
  </div>
);

const OrderMobileFields: FC<Pick<OrderMobileCardProps, 'order'>> = ({ order }) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    {getOrderFields(order).map((field) => <Field key={field.label} {...field} />)}
  </div>
);

const Field: FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div>
    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
    <p className="break-words text-sm text-gray-700 dark:text-gray-200">{value || '-'}</p>
  </div>
);

const PaymentProofLink: FC<Pick<OrderMobileCardProps, 'order'>> = ({ order }) =>
  order.payment_proof_url ? (
    <a href={order.payment_proof_url} target="_blank" rel="noreferrer" className={proofLinkClass} aria-label={`Lihat bukti bayar ${order.order_number}`} title="Lihat bukti bayar">
      Lihat Bukti <ExternalLink size={13} />
    </a>
  ) : null;

const OrderMobileActions: FC<OrderMobileCardProps> = (props) => {
  if (props.order.status === 'WAITING_CONFIRMATION') return <ActionWrap><ReviewActions {...props} /></ActionWrap>;
  if (isManualWaitingPayment(props.order)) return <ActionWrap><ManualCancel {...props} /></ActionWrap>;
  return null;
};

const ReviewActions: FC<OrderMobileCardProps> = (props) => (
  <div className="grid grid-cols-2 gap-2">
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
  <div className="mt-4">{children}</div>
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

const proofLinkClass = 'mt-4 flex h-11 items-center justify-center gap-2 rounded-xl border border-blue-100 text-sm font-medium text-blue-600 dark:border-blue-900/40';
const manualCancelClass = 'h-11 w-full rounded-xl border border-red-200 text-sm font-medium text-red-600 disabled:opacity-50';
const acceptButtonClass = 'flex h-11 items-center justify-center gap-2 rounded-xl bg-green-50 text-sm font-medium text-green-700 disabled:opacity-50';
const rejectButtonClass = 'flex h-11 items-center justify-center gap-2 rounded-xl bg-red-50 text-sm font-medium text-red-700 disabled:opacity-50';

interface StatusButtonProps extends OrderMobileCardProps {
  status: string;
  label: string;
  icon: ReactNode;
  danger?: boolean;
}
