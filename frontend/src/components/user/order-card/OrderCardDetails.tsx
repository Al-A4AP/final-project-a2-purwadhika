import type { FC } from "react";
import type { OrderCardProps } from "./types";
import { OrderPaymentActions } from "./OrderPaymentActions";
import { OrderPaymentInfo } from "./OrderPaymentInfo";
import { OrderReviewControls } from "./OrderReviewControls";
import { OrderStayInfo } from "./OrderStayInfo";

export const OrderCardDetails: FC<Omit<OrderCardProps, "StatusBadge" | "comment" | "handleReviewSubmit" | "rating" | "setComment" | "setRating" | "submittingReview">> = (props) => (
  <div className="flex flex-col justify-between gap-4 text-sm md:flex-row md:items-end">
    <OrderStayInfo order={props.order} />
    <OrderPaymentInfo order={props.order} />
    <div>
      <OrderPaymentActions order={props.order} uploading={props.uploading} handleUploadClick={props.handleUploadClick} />
      <OrderReviewControls order={props.order} reviewOrderId={props.reviewOrderId} setReviewOrderId={props.setReviewOrderId} />
    </div>
  </div>
);
