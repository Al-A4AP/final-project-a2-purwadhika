import type { FC } from "react";
import type { Order } from "@/types";
import { EmptyUpcomingStay, UpcomingStayCard } from "./DashboardUpcomingStayParts";

interface DashboardUpcomingStayProps {
  order: Order | null;
}

export const DashboardUpcomingStay: FC<DashboardUpcomingStayProps> = ({
  order,
}) => {
  if (!order) return <EmptyUpcomingStay />;

  const checkIn = new Date(order.check_in_date);
  const checkOut = new Date(order.check_out_date);

  return <UpcomingStayCard checkIn={checkIn} checkOut={checkOut} order={order} />;
};
