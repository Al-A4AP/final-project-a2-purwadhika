import { OrderStatusBadge } from "@/components/tenant/OrderStatusBadge";
import { formatDate, formatPrice } from "@/lib/formatters";
import type { Order } from "@/types";

export const PaymentConfirmationDetails = ({ order }: { order: Order }) => (
  <div>
    <PaymentConfirmationSummary order={order} />
    <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
      <DetailItem label="Detail Tamu" title={order.user?.name} description={order.user?.email} />
      <DetailItem label="Properti & Kamar" title={order.property?.name} description={order.room?.room_type} />
      <DetailItem label="Periode Inap" title={`${formatDate(order.check_in_date)} - ${formatDate(order.check_out_date)}`} />
      <DetailItem label="Total & Metode" title={formatPrice(order.total_price)} description={order.payment_method} titleClassName="text-lg font-bold" />
    </div>
  </div>
);

const PaymentConfirmationSummary = ({ order }: { order: Order }) => (
  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
    <div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{order.order_number}</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatDate(order.created_at || new Date().toISOString())}</p>
    </div>
    <OrderStatusBadge status={order.status} />
  </div>
);

const DetailItem = ({ description, label, title, titleClassName = "font-medium" }: DetailItemProps) => (
  <div>
    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
    <p className={`mt-1.5 text-slate-900 dark:text-white ${titleClassName}`}>{title || "-"}</p>
    {description && <p className="text-sm text-slate-500">{description}</p>}
  </div>
);

interface DetailItemProps {
  description?: string;
  label: string;
  title?: string;
  titleClassName?: string;
}

