import type { FC } from "react";
import type { Order } from "@/types";
import { DashboardRecentHeader, DashboardRecentRow } from "./DashboardRecentParts";

interface DashboardRecentProps {
  orders: Order[];
}

export const DashboardRecent: FC<DashboardRecentProps> = ({ orders }) => {
  if (orders.length === 0) return null;

  return (
    <div className="mb-8">
      <DashboardRecentHeader />
      <div className="space-y-4">
        {orders.map((order) => <DashboardRecentRow key={order.id} order={order} />)}
      </div>
    </div>
  );
};
