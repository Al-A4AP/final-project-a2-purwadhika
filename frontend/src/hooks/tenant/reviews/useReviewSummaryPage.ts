import { useMemo, useState } from "react";
import type { ReviewRatingSummaryItem } from "@/types";

const SUMMARY_PAGE_SIZE = 5;

export const useReviewSummaryPage = (items: ReviewRatingSummaryItem[]) => {
  const [currentPage, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / SUMMARY_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = useMemo(() => getPageItems(items, safePage), [items, safePage]);
  return { currentPage: safePage, items: pageItems, setPage, totalPages };
};

const getPageItems = (items: ReviewRatingSummaryItem[], page: number) => {
  const start = (page - 1) * SUMMARY_PAGE_SIZE;
  return items.slice(start, start + SUMMARY_PAGE_SIZE);
};

export type ReviewSummaryPage = ReturnType<typeof useReviewSummaryPage>;
