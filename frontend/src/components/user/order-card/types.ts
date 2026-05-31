import type { FC, FormEvent } from "react";
import type { Order } from "@/types";

export interface OrderCardProps {
  StatusBadge: FC<{ status: string }>;
  comment: string;
  handleReviewSubmit: (event: FormEvent) => void;
  handleUploadClick: (id: string) => void;
  order: Order;
  rating: number;
  reviewOrderId: string | null;
  setComment: (comment: string) => void;
  setRating: (rating: number) => void;
  setReviewOrderId: (id: string | null) => void;
  submittingReview: boolean;
  uploading: string | null;
}
