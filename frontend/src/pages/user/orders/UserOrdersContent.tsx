import type { FC } from "react";
import type { RefObject } from "react";
import { HelpText } from "@/components/common/HelpText";
import type { UserOrdersState } from "./userOrdersTypes";
import { UserOrdersFilter } from "./UserOrdersFilter";
import { UserOrdersList } from "./UserOrdersList";

interface UserOrdersContentProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  state: UserOrdersState;
}

export const UserOrdersContent: FC<UserOrdersContentProps> = ({ fileInputRef, state }) => {
  if (state.loading) return <div className="p-10 text-center">Loading...</div>;
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 space-y-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Riwayat Pesanan Saya</h1>
        <HelpText>Gunakan filter untuk mencari pesanan. Pesanan manual akan menampilkan tombol unggah bukti bayar saat masih menunggu pembayaran.</HelpText>
      </div>
      <input type="file" ref={fileInputRef} onChange={state.handleFileChange} accept="image/*" className="hidden" />
      <UserOrdersFilter actions={state.filterActions} filters={state.filters} onSearch={() => state.fetchOrders(1)} />
      <UserOrdersList state={state} />
    </div>
  );
};
