import type { FC } from "react";
import type { RefObject } from "react";
import { SectionLoading } from "@/components/common/SectionLoading";
import type { UserOrdersState } from "@/hooks/user/orders/userOrdersTypes";
import { UserCancelOrderModal } from "./UserCancelOrderModal";
import { UserOrdersFilter } from "./UserOrdersFilter";
import { UserOrdersList } from "./UserOrdersList";
import { BedDouble } from "lucide-react";
import { UserDashboardBackLink } from "@/components/user/UserDashboardBackLink";

interface UserOrdersContentProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  state: UserOrdersState;
}

export const UserOrdersContent: FC<UserOrdersContentProps> = ({ fileInputRef, state }) => {
  const totalOrders = state.pagination.total || 0;
  
  if (state.loading && state.orders.length === 0) {
    return <SectionLoading className="mx-auto max-w-5xl px-4 py-12" label="Memuat riwayat pemesanan..." size="md" variant="cards" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 pt-8 md:pt-12">
      <div className="mx-auto max-w-5xl px-4 space-y-8">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 md:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6">
            <UserDashboardBackLink />
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Riwayat Reservasi</h1>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl">
                Lacak status reservasi Anda, unggah bukti pembayaran, atau berikan ulasan untuk tempat yang sudah Anda inapi.
              </p>
            </div>
            {totalOrders > 0 && (
              <div className="flex gap-4">
                <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/10 px-4 py-3 rounded-2xl border border-red-100 dark:border-red-900/30">
                  <div className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500 p-2 rounded-xl">
                    <BedDouble size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reservasi</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white leading-none mt-1">{totalOrders}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <UserOrdersFilter actions={state.filterActions} filters={state.filters} onSearch={() => state.fetchOrders(1)} />
        </div>

        <input type="file" ref={fileInputRef} onChange={state.handleFileChange} accept="image/*" className="hidden" />
        
        <div className="relative min-h-[400px]">
          {state.loading && state.orders.length > 0 && (
            <div className="absolute inset-0 z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl flex justify-center pt-20">
              <SectionLoading variant="booking" />
            </div>
          )}
          <UserOrdersList state={state} />
        </div>
        
        <UserCancelOrderModal state={state} />
      </div>
    </div>
  );
};
