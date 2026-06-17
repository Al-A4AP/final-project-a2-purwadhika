import type { FC } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { SectionLoading } from "@/components/common/SectionLoading";
import { UserDashboardBackLink } from "@/components/user/UserDashboardBackLink";
import { OrderReviewForm } from "@/components/user/order-card/OrderReviewForm";
import type { useUserReviewsState } from "@/hooks/user/reviews/useUserReviewsState";
import type { Order } from "@/types";
import { EligibleReviewCard } from "./EligibleReviewCard";
import { SubmittedReviewCard } from "./SubmittedReviewCard";

type ReviewsState = ReturnType<typeof useUserReviewsState>;

export const ReviewsErrorPanel: FC<{ error: string }> = ({ error }) => (
  <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-slate-900 md:p-12">
    <div className="mx-auto max-w-5xl rounded-3xl border border-red-200 bg-red-50 p-12 text-center dark:border-red-900/50 dark:bg-red-900/10">
      <h2 className="mb-4 text-xl font-bold text-red-600 dark:text-red-500">Gagal Memuat</h2>
      <p className="mb-6 text-slate-600 dark:text-slate-400">{error}</p>
      <button onClick={() => window.location.reload()} className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900">Coba Lagi</button>
    </div>
  </div>
);

export const ReviewsHeader: FC = () => (
  <div>
    <div className="mb-4"><UserDashboardBackLink /></div>
    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Ulasan Saya</h1>
    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Kelola dan lihat ulasan yang telah Anda berikan untuk properti yang pernah Anda kunjungi.</p>
  </div>
);

export const ReviewsTabs: FC<Pick<ReviewsState, "activeTab" | "setActiveTab">> = ({
  activeTab,
  setActiveTab,
}) => (
  <div className="flex space-x-2 border-b border-slate-200 pb-px dark:border-slate-800">
    <ReviewTabButton active={activeTab === "pending"} onClick={() => setActiveTab("pending")} label="Menunggu Ulasan" />
    <ReviewTabButton active={activeTab === "submitted"} onClick={() => setActiveTab("submitted")} label="Riwayat Ulasan" />
  </div>
);

export const ReviewsLoading: FC = () => (
  <SectionLoading className="mx-auto max-w-5xl px-4 py-12" variant="report" label="Memuat ulasan Anda..." />
);

export const PendingReviewsList: FC<{ orders: Order[]; state: ReviewsState }> = ({
  orders,
  state,
}) => (
  <div className="grid grid-cols-1 gap-6">
    {orders.map((order) => <PendingReviewItem key={order.id} order={order} state={state} />)}
  </div>
);

export const SubmittedReviewsList: FC<{ orders: Order[] }> = ({ orders }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    {orders.map((order) => <SubmittedReviewCard key={order.id} order={order} />)}
  </div>
);

export const ReviewsEmptyState: FC<{ activeTab: ReviewsState["activeTab"] }> = ({
  activeTab,
}) => (
  <div className="mt-12 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <EmptyState title={getEmptyTitle(activeTab)} description={getEmptyDescription(activeTab)} action={<ReviewsEmptyAction />} />
  </div>
);

export const ReviewsPagination: FC<Pick<ReviewsState, "pagination" | "handlePageChange">> = ({
  pagination,
  handlePageChange,
}) => (
  <div className="mt-8 flex justify-center">
    <Pagination currentPage={pagination.page} totalPages={pagination.totalPages || 1} onPageChange={handlePageChange} />
  </div>
);

const ReviewTabButton: FC<{ active: boolean; label: string; onClick: () => void }> = ({
  active,
  label,
  onClick,
}) => (
  <button onClick={onClick} className={`border-b-2 px-6 py-3 text-sm font-semibold transition-colors ${active ? "border-slate-900 text-slate-900 dark:border-white dark:text-white" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}>{label}</button>
);

const PendingReviewItem: FC<{ order: Order; state: ReviewsState }> = ({
  order,
  state,
}) => (
  <div>
    <EligibleReviewCard order={order} onWriteReview={state.setReviewOrderId} />
    {state.reviewOrderId === order.id && <ReviewFormPanel order={order} state={state} />}
  </div>
);

const ReviewFormPanel: FC<{ order: Order; state: ReviewsState }> = ({
  order,
  state,
}) => (
  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-900/10">
    <h3 className="mb-2 text-lg font-bold text-amber-900 dark:text-amber-500">Berikan Ulasan untuk {order.property?.name}</h3>
    <OrderReviewForm {...state} />
    <button onClick={() => state.setReviewOrderId(null)} className="mt-4 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">Batal</button>
  </div>
);

const ReviewsEmptyAction: FC = () => (
  <Link to="/orders" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900">
    <ShoppingBag className="mr-2 h-5 w-5" /> Lihat Riwayat Pemesanan
  </Link>
);

const getEmptyTitle = (activeTab: ReviewsState["activeTab"]) =>
  activeTab === "pending" ? "Belum Ada Ulasan Tertunda" : "Belum Ada Ulasan Terkirim";

const getEmptyDescription = (activeTab: ReviewsState["activeTab"]) =>
  activeTab === "pending" ? "Selesaikan reservasi Anda untuk membagikan pengalaman menginap Anda." : "Anda belum pernah mengirimkan ulasan.";
