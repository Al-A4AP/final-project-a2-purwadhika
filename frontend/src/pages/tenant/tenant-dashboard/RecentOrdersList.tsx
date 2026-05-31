import type { FC } from "react";
import type { RecentOrder } from "@/types";
import { RecentOrderRow } from "./RecentOrderRow";
import { RecentOrdersEmpty } from "./RecentOrdersEmpty";

export const RecentOrdersList: FC<{ orders?: RecentOrder[] }> = ({ orders }) => (
  <div className="divide-y dark:divide-slate-700">
    {orders?.length ? orders.map((order) => <RecentOrderRow key={order.id} order={order} />) : <RecentOrdersEmpty />}
  </div>
);
