import type { FC } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import { OrderPaymentActions } from "./OrderPaymentActions";
import type { OrderCardProps } from "./types";

export const OrderCardFooter: FC<OrderCardProps> = (props) => (
  <div className="flex flex-col justify-between gap-6 border-t border-slate-100 pt-6 dark:border-slate-800 md:flex-row md:items-end">
    <OrderTotal totalPrice={props.order.total_price} />
    <OrderActionGroup {...props} />
  </div>
);

const OrderTotal: FC<{ totalPrice: number }> = ({ totalPrice }) => (
  <div>
    <p className="mb-1 text-xs font-semibold uppercase text-slate-500">Total Pembayaran</p>
    <p className="text-2xl font-bold text-red-600">{formatPrice(totalPrice)}</p>
  </div>
);

const OrderActionGroup: FC<OrderCardProps> = (props) => (
  <div className="flex flex-col items-center gap-3 sm:flex-row">
    <OrderPaymentActions order={props.order} uploading={props.uploading} handleUploadClick={props.handleUploadClick} canceling={props.canceling} handleCancelClick={props.handleCancelClick} paymentActionId={props.paymentActionId} retryMidtransPayment={props.retryMidtransPayment} switchToManualPayment={props.switchToManualPayment} />
    <ReviewButton {...props} />
    <DetailLink id={props.order.id} />
  </div>
);

const ReviewButton: FC<Pick<OrderCardProps, "order" | "setReviewOrderId">> = ({ order, setReviewOrderId }) => {
  if (order.status !== "COMPLETED" || order.review) return null;
  return (
    <button onClick={() => setReviewOrderId(order.id)} className="w-full rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-600 sm:w-auto">
      Beri Ulasan
    </button>
  );
};

const DetailLink: FC<{ id: string }> = ({ id }) => (
  <Link to={`/orders/${id}`} className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 sm:w-auto">
    Detail <ChevronRight size={16} className="ml-1" />
  </Link>
);
