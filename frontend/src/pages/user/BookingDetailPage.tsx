import type { FC } from "react";
import { SectionLoading } from "@/components/common/SectionLoading";
import { useBookingDetailState } from "./orders/useBookingDetailState";
import { BookingDetailHeader } from "./orders/BookingDetailHeader";
import { BookingStatusTimeline } from "./orders/BookingStatusTimeline";
import { BookingPropertySummary } from "./orders/BookingPropertySummary";
import { BookingPaymentPanel } from "./orders/BookingPaymentPanel";
import { OrderReviewForm } from "@/components/user/order-card/OrderReviewForm";
import { UserCancelOrderModal } from "./orders/UserCancelOrderModal";
import { Link } from "react-router-dom";

const BookingDetailPage: FC = () => {
  const detail = useBookingDetailState();
  const { error, fileInputRef, loading, order, state } = detail;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 pt-8 md:pt-12">
        <SectionLoading className="mx-auto max-w-4xl px-4" variant="report" label="Mengambil informasi reservasi..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 pt-8 md:pt-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-12 dark:border-red-900/50 dark:bg-red-900/10">
            <h2 className="mb-4 text-xl font-bold text-red-600 dark:text-red-500">Gagal Memuat</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{error || 'Pesanan tidak ditemukan.'}</p>
            <Link to="/orders" className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900">
              Kembali ke Riwayat
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-12 dark:bg-slate-900 pb-24">
      <div className="mx-auto max-w-4xl">
        <BookingDetailHeader order={order} />
        <BookingStatusTimeline status={order.status} />
        <BookingPropertySummary order={order} />
        
        <BookingPaymentPanel 
          order={order}
          uploading={state.uploading}
          handleUploadClick={state.handleUploadClick}
          canceling={state.canceling}
          handleCancelClick={state.handleCancelClick}
          paymentActionId={state.paymentActionId}
          retryMidtransPayment={state.retryMidtransPayment}
          switchToManualPayment={state.switchToManualPayment}
        />

        {order.status === 'COMPLETED' && !order.review && state.reviewOrderId !== order.id && (
          <div className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm dark:border-amber-900/50 dark:bg-amber-900/10 text-center">
            <h2 className="mb-2 text-xl font-bold text-amber-900 dark:text-amber-500">Bagaimana pengalaman menginap Anda?</h2>
            <p className="mb-6 text-amber-700 dark:text-amber-400">Bantu tamu lain dengan memberikan ulasan tentang {order.property?.name}.</p>
            <button 
              onClick={() => state.setReviewOrderId(order.id)}
              className="rounded-xl bg-amber-500 px-8 py-3 font-bold text-white transition hover:bg-amber-600 shadow-sm"
            >
              Beri Ulasan Sekarang
            </button>
          </div>
        )}

        {state.reviewOrderId === order.id && (
          <div className="mb-8 rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Ulasan Anda</h2>
            <OrderReviewForm {...state} />
          </div>
        )}

        {order.review && (
          <div className="mb-8 rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Ulasan Anda</h2>
            <div className="flex items-center gap-1 mb-2 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className={`h-5 w-5 ${i < order.review!.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-slate-700 dark:text-slate-300 italic">"{order.review.comment}"</p>
          </div>
        )}

        {/* Hidden File Input for Uploading Proof */}
        <input type="file" ref={fileInputRef} onChange={state.handleFileChange} accept="image/*" className="hidden" />
        
        {/* We need to render the cancel modal globally for this order page state */}
        <UserCancelOrderModal state={state} />
      </div>
    </div>
  );
};

export default BookingDetailPage;
