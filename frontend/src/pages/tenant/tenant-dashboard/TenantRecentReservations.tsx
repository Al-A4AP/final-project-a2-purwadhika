import type { FC } from "react";
import type { RecentOrder } from "@/types";
import {
  EmptyRecentReservations,
  RecentReservationRow,
  RecentReservationsHeader,
} from "./TenantRecentReservationsParts";

interface TenantRecentReservationsProps {
  orders?: RecentOrder[];
}

export const TenantRecentReservations: FC<TenantRecentReservationsProps> = ({ orders }) =>
  !orders || orders.length === 0 ? <EmptyRecentReservations /> : (
    <div className="mb-8 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
      <RecentReservationsHeader />
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {orders.map((order) => (
          <RecentReservationRow key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
