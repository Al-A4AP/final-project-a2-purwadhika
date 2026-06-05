import type { FC } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionLoading } from "@/components/common/SectionLoading";
import { ShoppingBag } from "lucide-react";
import { useUserReviewsState } from "./reviews/useUserReviewsState";
import { ReviewSummaryCards } from "./reviews/ReviewSummaryCards";
import { EligibleReviewCard } from "./reviews/EligibleReviewCard";
import { SubmittedReviewCard } from "./reviews/SubmittedReviewCard";
import { OrderReviewForm } from "@/components/user/order-card/OrderReviewForm";

const UserReviewsPage: FC = () => {
  const state = useUserReviewsState();
  const { loading, error, eligibleOrders, submittedReviews, averageRating, totalReviews, reviewOrderId, setReviewOrderId } = state;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-24 pt-8 md:pt-12">
        <SectionLoading className="mx-auto max-w-5xl px-4" variant="report" label="Memuat ulasan Anda..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 md:p-12 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl rounded-3xl border border-red-200 bg-red-50 p-12 text-center dark:border-red-900/50 dark:bg-red-900/10">
          <h2 className="mb-4 text-xl font-bold text-red-600 dark:text-red-500">Gagal Memuat</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const hasAnyData = eligibleOrders.length > 0 || submittedReviews.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:p-12 dark:bg-slate-900 pb-24">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Ulasan Saya</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Kelola dan lihat ulasan yang telah Anda berikan untuk properti yang pernah Anda kunjungi.</p>
        </div>

        {hasAnyData && (
          <ReviewSummaryCards totalReviews={totalReviews} eligibleCount={eligibleOrders.length} averageRating={averageRating} />
        )}

        {eligibleOrders.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Menunggu Ulasan Anda</h2>
            <div className="grid grid-cols-1 gap-6">
              {eligibleOrders.map((order) => (
                <div key={order.id}>
                  <EligibleReviewCard order={order} onWriteReview={setReviewOrderId} />
                  {reviewOrderId === order.id && (
                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-900/10">
                      <h3 className="mb-2 text-lg font-bold text-amber-900 dark:text-amber-500">Berikan Ulasan untuk {order.property?.name}</h3>
                      <OrderReviewForm {...state} />
                      <button onClick={() => setReviewOrderId(null)} className="mt-4 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                        Batal
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {submittedReviews.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Ulasan Terkirim</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {submittedReviews.map((order) => (
                <SubmittedReviewCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}

        {!hasAnyData && (
          <div className="mt-12 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <EmptyState 
              title="Belum Ada Ulasan" 
              description="Anda belum memberikan ulasan apa pun. Selesaikan reservasi Anda untuk membagikan pengalaman menginap Anda."
              action={
                <Link to="/orders" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                  <ShoppingBag className="mr-2 h-5 w-5"/> Lihat Riwayat Pemesanan
                </Link>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReviewsPage;
