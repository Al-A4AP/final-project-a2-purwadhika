import type { FC } from "react";
import type { OrderCardProps } from "./types";
import { ReviewCommentField } from "./ReviewCommentField";
import { ReviewRatingField } from "./ReviewRatingField";
import { ReviewSubmitButton } from "./ReviewSubmitButton";

export const OrderReviewForm: FC<Pick<OrderCardProps, "comment" | "handleReviewSubmit" | "rating" | "setComment" | "setRating" | "submittingReview">> = (props) => (
  <form onSubmit={props.handleReviewSubmit} className="mt-4 rounded-lg border bg-gray-50 p-4 dark:border-slate-600 dark:bg-slate-700/50">
    <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Berikan Ulasan Anda</h4>
    <ReviewRatingField rating={props.rating} setRating={props.setRating} />
    <ReviewCommentField comment={props.comment} setComment={props.setComment} />
    <ReviewSubmitButton submittingReview={props.submittingReview} />
  </form>
);
