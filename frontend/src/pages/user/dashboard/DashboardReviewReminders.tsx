import type { FC } from "react";
import type { Order } from "@/types";
import {
  ReviewReminderCard,
  ReviewRemindersHeader,
} from "./DashboardReviewRemindersParts";

const MAX_VISIBLE_REVIEWS = 5;

interface DashboardReviewRemindersProps {
  orders: Order[];
}

export const DashboardReviewReminders: FC<DashboardReviewRemindersProps> = ({
  orders,
}) =>
  orders.length === 0 ? null : (
    <div className="mb-8">
      <ReviewRemindersHeader showAllLink={orders.length > MAX_VISIBLE_REVIEWS} />
      <div className="space-y-4">
        {orders.slice(0, MAX_VISIBLE_REVIEWS).map((order) => (
          <ReviewReminderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
