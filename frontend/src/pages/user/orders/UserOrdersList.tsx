import type { FC } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Pagination } from "@/components/common/Pagination";
import { OrderCard } from "@/components/user/OrderCard";
import type { UserOrdersState } from "./userOrdersTypes";
import { UserOrderStatusBadge } from "./UserOrderStatusBadge";

export const UserOrdersList: FC<{ state: UserOrdersState }> = ({ state }) => {
  if (state.error) return <ErrorState title="Pesanan belum bisa dimuat" message={state.error} onRetry={() => state.fetchOrders(state.pagination.page || 1)} />;
  if (!state.orders.length) return <EmptyOrders />;
  const totalPages = state.pagination.totalPages || state.pagination.pages || 1;
  return <div className="space-y-4">{state.orders.map((order) => <OrderCard key={order.id} order={order} uploading={state.uploading} handleUploadClick={state.handleUploadClick} canceling={state.canceling} handleCancelClick={state.handleCancelClick} reviewOrderId={state.reviewOrderId} setReviewOrderId={state.setReviewOrderId} rating={state.rating} setRating={state.setRating} comment={state.comment} setComment={state.setComment} handleReviewSubmit={state.handleReviewSubmit} submittingReview={state.submittingReview} StatusBadge={UserOrderStatusBadge} />)}<Pagination currentPage={state.pagination.page || 1} totalPages={totalPages} totalItems={state.pagination.total} onPageChange={state.fetchOrders} /></div>;
};

const EmptyOrders: FC = () => (
  <EmptyState title="Belum ada riwayat pesanan" description="Pesanan yang Anda buat akan muncul di halaman ini." />
);
