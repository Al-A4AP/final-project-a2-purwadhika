import type { FC } from "react";
import type { Review } from "@/types";
import { RatingStars } from "./RatingStars";
import { ReviewAvatar } from "./ReviewAvatar";

export const ReviewAuthor: FC<{ review: Review }> = ({ review }) => (
  <div className="flex items-center gap-4"><ReviewAvatar user={review.user} /><div><p className="font-semibold text-gray-900 dark:text-white">{review.user?.name}</p><RatingStars rating={review.rating} /></div></div>
);
