import { ErrorState } from "@/components/common/ErrorState";
import { SectionLoading } from "@/components/common/SectionLoading";
import { Pagination } from "@/components/common/Pagination";
import type { PaymentConfirmationState } from "./paymentConfirmationTypes";
import { PaymentConfirmationEmpty } from "./PaymentConfirmationEmpty";
import { PaymentConfirmationList } from "./PaymentConfirmationList";

export const PaymentConfirmationContent = ({ state }: { state: PaymentConfirmationState }) => (
  <div className="space-y-6">
    {state.loading && <SectionLoading label="Memuat antrean..." />}
    {state.error && <ErrorState title="Gagal memuat" message={state.error} onRetry={() => state.fetchOrders(state.pagination.page || 1)} />}
    {!state.loading && !state.error && state.orders.length === 0 && <PaymentConfirmationEmpty />}
    {!state.loading && !state.error && state.orders.length > 0 && <PaymentConfirmationList state={state} />}
    {shouldShowPagination(state) && (
      <div className="rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <Pagination currentPage={state.pagination.page || 1} totalPages={state.pagination.totalPages || 1} totalItems={state.pagination.total} onPageChange={state.fetchOrders} />
      </div>
    )}
  </div>
);

const shouldShowPagination = (state: PaymentConfirmationState) =>
  !state.loading && !state.error && state.orders.length > 0 && (state.pagination.totalPages || 1) > 1;

