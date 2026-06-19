import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { tenantService } from "@/services/tenantService";
import type { Review, ReviewReply } from "@/types";
import type { ReplyTextMap, SubmittingMap } from "./tenantReviewsTypes";
import { REVIEW_REPLY_MAX_LENGTH } from "@/constants/validation";

export const useReviewReplies = (setReviews: React.Dispatch<React.SetStateAction<Review[]>>) => {
  const [replyText, setReplyText] = useState<ReplyTextMap>({});
  const [submitting, setSubmitting] = useState<SubmittingMap>({});
  const handleReplyChange = useCallback((id: string, text: string) => setReplyText((prev) => ({ ...prev, [id]: text })), []);
  const handleReplySubmit = useReplySubmit(replyText, setReplyText, setReviews, setSubmitting);
  return { handleReplyChange, handleReplySubmit, replyText, submitting };
};

const useReplySubmit = (
  replyText: ReplyTextMap,
  setReplyText: React.Dispatch<React.SetStateAction<ReplyTextMap>>,
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>,
  setSubmitting: React.Dispatch<React.SetStateAction<SubmittingMap>>,
) => useCallback(async (reviewId: string) => {
  const text = replyText[reviewId]?.trim() || "";
  if (text.length > REVIEW_REPLY_MAX_LENGTH) {
    toast.error(`Balasan maksimal ${REVIEW_REPLY_MAX_LENGTH} karakter`);
    return;
  }
  await submitReply(reviewId, text, setReplyText, setReviews, setSubmitting);
}, [replyText, setReplyText, setReviews, setSubmitting]);

const submitReply = async (
  reviewId: string,
  text: string,
  setReplyText: React.Dispatch<React.SetStateAction<ReplyTextMap>>,
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>,
  setSubmitting: React.Dispatch<React.SetStateAction<SubmittingMap>>,
) => {
  setSubmitting((prev) => ({ ...prev, [reviewId]: true }));
  try { const reply = await tenantService.replyToReview(reviewId, text); onReplySuccess(reviewId, reply, setReplyText, setReviews); }
  catch { toast.error("Gagal mengirim balasan"); }
  finally { setSubmitting((prev) => ({ ...prev, [reviewId]: false })); }
};

const onReplySuccess = (
  reviewId: string,
  reply: ReviewReply,
  setReplyText: React.Dispatch<React.SetStateAction<ReplyTextMap>>,
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>,
) => {
  toast.success("Balasan berhasil dikirim");
  setReviews((prev) => prev.map((review) => appendReply(review, reviewId, reply)));
  setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
};

const appendReply = (review: Review, reviewId: string, reply: ReviewReply) =>
  review.id === reviewId ? { ...review, replies: [...(review.replies || []), reply] } : review;
