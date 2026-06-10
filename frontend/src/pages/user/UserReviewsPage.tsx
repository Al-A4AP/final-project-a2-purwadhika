import type { FC } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionLoading } from "@/components/common/SectionLoading";
import { Pagination } from "@/components/common/Pagination";
import { ShoppingBag } from "lucide-react";
import { useUserReviewsState } from "@/hooks/user/reviews/useUserReviewsState";
import { EligibleReviewCard } from "./reviews/EligibleReviewCard";
import { SubmittedReviewCard } from "./reviews/SubmittedReviewCard";
import { OrderReviewForm } from "@/components/user/order-card/OrderReviewForm";
import { UserDashboardBackLink } from "@/components/user/UserDashboardBackLink";

const UserReviewsPage: FC = () => {
  const state = useUserReviewsState();
  const { loading, error, orders, pagination, activeTab, setActiveTab, reviewOrderId, setReviewOrderId } = state;

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

  const hasAnyData = orders.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:p-12 dark:bg-slate-900 pb-24">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <div className="mb-4">
            <UserDashboardBackLink />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Ulasan Saya</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Kelola dan lihat ulasan yang telah Anda berikan untuk properti yang pernah Anda kunjungi.</p>
        </div>

        <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-px">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'pending' ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            Menunggu Ulasan
          </button>
          <button
            onClick={() => setActiveTab('submitted')}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'submitted' ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            Riwayat Ulasan
          </button>
        </div>

        {loading ? (
          <SectionLoading className="mx-auto max-w-5xl px-4 py-12" variant="report" label="Memuat ulasan Anda..." />
        ) : (
          <>
            {activeTab === 'pending' && hasAnyData && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-6">
                  {orders.map((order) => (
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

            {activeTab === 'submitted' && hasAnyData && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {orders.map((order) => (
                    <SubmittedReviewCard key={order.id} order={order} />
                  ))}
                </div>
              </div>
            )}

            {!hasAnyData && (
              <div className="mt-12 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <EmptyState 
                  title={activeTab === 'pending' ? "Belum Ada Ulasan Tertunda" : "Belum Ada Ulasan Terkirim"} 
                  description={activeTab === 'pending' ? "Selesaikan reservasi Anda untuk membagikan pengalaman menginap Anda." : "Anda belum pernah mengirimkan ulasan."}
                  action={
                    <Link to="/orders" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                      <ShoppingBag className="mr-2 h-5 w-5"/> Lihat Riwayat Pemesanan
                    </Link>
                  }
                />
              </div>
            )}

            {hasAnyData && pagination && (pagination.totalPages || 1) > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages || 1}
                  onPageChange={state.handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserReviewsPage;
