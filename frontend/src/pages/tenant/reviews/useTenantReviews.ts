import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { tenantService } from "@/services/tenantService";
import type { PaginationMeta, Review } from "@/types";

interface ReviewsResponse {
  pagination: PaginationMeta;
  reviews: Review[];
}

export const useTenantReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const fetchReviews = useFetchReviews(setReviews, setPagination);
  useEffect(() => { fetchReviews(1).finally(() => setLoading(false)); }, [fetchReviews]);
  const handlePageChange = usePageChange(fetchReviews, setLoading);
  return { fetchReviews, handlePageChange, loading, pagination, reviews, setReviews };
};

const useFetchReviews = (
  setReviews: (reviews: Review[]) => void,
  setPagination: (pagination: PaginationMeta) => void,
) => useCallback((page = 1) => tenantService.getReviews({ page, limit: 10 })
  .then((data: ReviewsResponse) => { setReviews(data.reviews); setPagination(data.pagination); })
  .catch(() => { toast.error("Gagal memuat ulasan"); }), [setPagination, setReviews]);

const usePageChange = (
  fetchReviews: (page?: number) => Promise<void>,
  setLoading: (loading: boolean) => void,
) => useCallback((page: number) => {
  setLoading(true);
  fetchReviews(page).finally(() => setLoading(false));
}, [fetchReviews, setLoading]);
