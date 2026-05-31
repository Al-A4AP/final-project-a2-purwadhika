import type { FC } from "react";
import type { RecentOrder } from "@/types";
import { RecentOrderAmount } from "./RecentOrderAmount";
import { RecentOrderInfo } from "./RecentOrderInfo";
import { RecentOrderStatus } from "./RecentOrderStatus";

export const RecentOrderRow: FC<{ order: RecentOrder }> = ({ order }) => (
  <div className="flex flex-col justify-between gap-3 p-4 dark:border-slate-700 sm:flex-row sm:items-center md:p-6">
    <RecentOrderInfo order={order} />
    <div className="mt-2 flex w-full flex-row-reverse items-center justify-between gap-2 border-t border-dashed border-gray-200 pt-3 dark:border-slate-700 sm:mt-0 sm:w-auto sm:flex-col sm:items-end sm:justify-center sm:border-none sm:pt-0">
      <RecentOrderStatus status={order.status} />
      <RecentOrderAmount totalPrice={order.total_price} />
    </div>
  </div>
);
