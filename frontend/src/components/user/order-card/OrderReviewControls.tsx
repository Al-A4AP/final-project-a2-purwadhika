import type { FC } from "react";
import { canReviewOrder } from "@/lib/orderStatus";
import type { Order } from "@/types";
import { ReviewedNotice } from "./ReviewedNotice";
import { ReviewToggleButton } from "./ReviewToggleButton";

interface OrderReviewControlsProps {
  order: Order;
  reviewOrderId: string | null;
  setReviewOrderId: (id: string | null) => void;
}

export const OrderReviewControls: FC<OrderReviewControlsProps> = ({ order, reviewOrderId, setReviewOrderId }) => (
  <>
    {canReviewOrder(order) && <ReviewToggleButton isOpen={reviewOrderId === order.id} onToggle={() => setReviewOrderId(reviewOrderId === order.id ? null : order.id)} />}
    {order.review && <ReviewedNotice />}
  </>
);
