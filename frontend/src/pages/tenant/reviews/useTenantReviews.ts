import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { tenantService } from "@/services/tenantService";
import type { PaginationMeta, Review, TenantReviewSummary } from "@/types";

interface ReviewsResponse {
  pagination: PaginationMeta;
  reviews: Review[];
  summary: TenantReviewSummary;
}

const emptySummary: TenantReviewSummary = { byCategory: [], byProperty: [] };

export const useTenantReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<TenantReviewSummary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const fetchReviews = useFetchReviews(setReviews, setSummary, setPagination, setError);
  useEffect(() => { fetchReviews(1).finally(() => setLoading(false)); }, [fetchReviews]);
  const handlePageChange = usePageChange(fetchReviews, setLoading);
  return { error, fetchReviews, handlePageChange, loading, pagination, reviews, setReviews, summary };
};

const useFetchReviews = (
  setReviews: (reviews: Review[]) => void,
  setSummary: (summary: TenantReviewSummary) => void,
  setPagination: (pagination: PaginationMeta) => void,
  setError: (error: string | null) => void,
) => useCallback((page = 1) => {
  setError(null);
  return tenantService.getReviews({ page, limit: 10 })
    .then((data: ReviewsResponse) => applyReviewsData(data, setReviews, setSummary, setPagination))
    .catch((err) => handleReviewsError(err, setError, setReviews, setSummary));
}, [setError, setPagination, setReviews, setSummary]);

const applyReviewsData = (
  data: ReviewsResponse,
  setReviews: (reviews: Review[]) => void,
  setSummary: (summary: TenantReviewSummary) => void,
  setPagination: (pagination: PaginationMeta) => void,
) => {
  setReviews(data.reviews);
  setSummary(data.summary || emptySummary);
  setPagination(data.pagination);
};

const handleReviewsError = (
  err: unknown,
  setError: (error: string | null) => void,
  setReviews: (reviews: Review[]) => void,
  setSummary: (summary: TenantReviewSummary) => void,
) => {
  const message = getApiErrorMessage(err, "Ulasan belum bisa dimuat. Periksa koneksi lalu coba lagi.");
  setError(message);
  setReviews([]);
  setSummary(emptySummary);
  toast.error(message);
};

const usePageChange = (
  fetchReviews: (page?: number) => Promise<void>,
  setLoading: (loading: boolean) => void,
) => useCallback((page: number) => {
  setLoading(true);
  fetchReviews(page).finally(() => setLoading(false));
}, [fetchReviews, setLoading]);
