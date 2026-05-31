import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { tenantService } from "@/services/tenantService";
import type { PaginationMeta, Review } from "@/types";

interface ReviewsResponse {
  pagination: PaginationMeta;
  reviews: Review[];
}

export const useTenantReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const fetchReviews = useFetchReviews(setReviews, setPagination, setError);
  useEffect(() => { fetchReviews(1).finally(() => setLoading(false)); }, [fetchReviews]);
  const handlePageChange = usePageChange(fetchReviews, setLoading);
  return { error, fetchReviews, handlePageChange, loading, pagination, reviews, setReviews };
};

const useFetchReviews = (
  setReviews: (reviews: Review[]) => void,
  setPagination: (pagination: PaginationMeta) => void,
  setError: (error: string | null) => void,
) => useCallback((page = 1) => {
  setError(null);
  return tenantService.getReviews({ page, limit: 10 })
    .then((data: ReviewsResponse) => { setReviews(data.reviews); setPagination(data.pagination); })
    .catch((err) => handleReviewsError(err, setError, setReviews));
}, [setError, setPagination, setReviews]);

const handleReviewsError = (
  err: unknown,
  setError: (error: string | null) => void,
  setReviews: (reviews: Review[]) => void,
) => {
  const message = getApiErrorMessage(err, "Ulasan belum bisa dimuat. Periksa koneksi lalu coba lagi.");
  setError(message);
  setReviews([]);
  toast.error(message);
};

const usePageChange = (
  fetchReviews: (page?: number) => Promise<void>,
  setLoading: (loading: boolean) => void,
) => useCallback((page: number) => {
  setLoading(true);
  fetchReviews(page).finally(() => setLoading(false));
}, [fetchReviews, setLoading]);
