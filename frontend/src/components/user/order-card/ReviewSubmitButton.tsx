import type { FC } from "react";

export const ReviewSubmitButton: FC<{ submittingReview: boolean }> = ({ submittingReview }) => (
  <button type="submit" disabled={submittingReview} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-70">
    {submittingReview ? "Mengirim..." : "Kirim Ulasan"}
  </button>
);
