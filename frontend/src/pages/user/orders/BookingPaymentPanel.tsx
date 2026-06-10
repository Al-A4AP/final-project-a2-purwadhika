import type { FC } from "react";
import { formatPrice } from "@/lib/formatters";
import { OrderPaymentActions } from "@/components/user/order-card/OrderPaymentActions";
import type { OrderCardProps } from "@/components/user/order-card/types";
import { getUserRefundStatus } from "@/lib/orderStatus";

export const BookingPaymentPanel: FC<Pick<OrderCardProps, "order" | "uploading" | "handleUploadClick" | "canceling" | "handleCancelClick" | "paymentActionId" | "retryMidtransPayment" | "switchToManualPayment">> = ({ 
  order, uploading, handleUploadClick, canceling, handleCancelClick, 
  paymentActionId, retryMidtransPayment, switchToManualPayment 
}) => {
  return (
    <div className="mb-8 rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">Informasi Pembayaran</h2>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 flex-1">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <span className="text-slate-500">Metode Pembayaran</span>
            <span className="font-semibold text-slate-900 dark:text-white">{order.payment_method === 'MANUAL' ? 'Transfer Bank (Manual)' : 'Otomatis (Midtrans)'}</span>
          </div>
          <div className="flex items-start sm:items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800 flex-col sm:flex-row gap-3">
            <span className="text-slate-500">Bukti Pembayaran</span>
            <div className="font-semibold text-slate-900 dark:text-white">
              {order.payment_proof_url ? (
                <PaymentProofThumbnail url={order.payment_proof_url} />
              ) : (
                <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">Belum Diunggah</span>
              )}
            </div>
          </div>
          {getUserRefundStatus(order) && (
            <div className="flex items-start sm:items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800 flex-col sm:flex-row gap-3">
              <span className="text-slate-500">Status Refund</span>
              <div className="font-semibold text-slate-900 dark:text-white">
                {getUserRefundStatus(order) === "PENDING" ? (
                  <span className="text-orange-600">Menunggu Refund Manual</span>
                ) : (
                  <span className="text-emerald-600">Refund selesai pada {new Date(order.refund_completed_at!).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between pt-2">
            <span className="font-bold text-slate-900 dark:text-white">Total Tagihan</span>
            <span className="text-2xl font-black text-red-600">{formatPrice(order.total_price)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:w-1/3">
          <OrderPaymentActions 
            order={order} 
            uploading={uploading} 
            handleUploadClick={handleUploadClick} 
            canceling={canceling} 
            handleCancelClick={handleCancelClick} 
            paymentActionId={paymentActionId} 
            retryMidtransPayment={retryMidtransPayment} 
            switchToManualPayment={switchToManualPayment} 
          />
        </div>
      </div>
    </div>
  );
};

const PaymentProofThumbnail: FC<{ url: string }> = ({ url }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-xl border border-slate-200 shadow-sm transition hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600">
    <img src={url} alt="Bukti Pembayaran" loading="lazy" className="h-24 w-20 object-cover transition-transform duration-300 group-hover:scale-105 sm:h-32 sm:w-24" />
  </a>
);
