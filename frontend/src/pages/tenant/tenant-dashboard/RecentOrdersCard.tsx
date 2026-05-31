import type { FC } from "react";
import type { RecentOrder } from "@/types";
import { RecentOrdersHeader } from "./RecentOrdersHeader";
import { RecentOrdersList } from "./RecentOrdersList";

export const RecentOrdersCard: FC<{ orders?: RecentOrder[] }> = ({ orders }) => (
  <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <RecentOrdersHeader />
    <RecentOrdersList orders={orders} />
  </div>
);
