import type { FC } from "react";
import { Pagination } from "@/components/common/Pagination";
import { OrderCard } from "@/components/user/OrderCard";
import type { UserOrdersState } from "./userOrdersTypes";
import { UserOrderStatusBadge } from "./UserOrderStatusBadge";

export const UserOrdersList: FC<{ state: UserOrdersState }> = ({ state }) => {
  if (!state.orders.length) return <EmptyOrders />;
  const totalPages = state.pagination.totalPages || state.pagination.pages || 1;
  return <div className="space-y-4">{state.orders.map((order) => <OrderCard key={order.id} order={order} uploading={state.uploading} handleUploadClick={state.handleUploadClick} reviewOrderId={state.reviewOrderId} setReviewOrderId={state.setReviewOrderId} rating={state.rating} setRating={state.setRating} comment={state.comment} setComment={state.setComment} handleReviewSubmit={state.handleReviewSubmit} submittingReview={state.submittingReview} StatusBadge={UserOrderStatusBadge} />)}<Pagination currentPage={state.pagination.page || 1} totalPages={totalPages} totalItems={state.pagination.total} onPageChange={state.fetchOrders} /></div>;
};

const EmptyOrders: FC = () => (
  <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700">
    <p className="text-gray-500">Belum ada riwayat pesanan.</p>
  </div>
);
