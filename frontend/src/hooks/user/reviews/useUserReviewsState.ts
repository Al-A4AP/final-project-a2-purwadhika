import { useCallback, useEffect, useRef, useState } from "react";
import { orderService } from "@/services/orderService";
import type { Order, PaginationMeta } from "@/types";
import { useReviewSubmission } from "../orders/useReviewSubmission";

export type ReviewTab = 'pending' | 'submitted';

export const useUserReviewsState = () => {
  const [activeTab, setActiveTab] = useState<ReviewTab>('pending');
  const { error, fetchOrders, loading, setLoading, orders, pagination, handlePageChange } = useReviewOrders(activeTab);
  const reviewActions = useReviewSubmission(orders, fetchOrders);

  const averageRating = activeTab === 'submitted' 
    ? (orders.length > 0 ? orders.reduce((sum, order) => sum + (order.review?.rating || 0), 0) / orders.length : 0)
    : 0;

  const handleTabChange = useCallback((tab: ReviewTab) => {
    if (tab === activeTab) return;
    setLoading(true);
    setActiveTab(tab);
  }, [activeTab, setLoading]);

  return { 
    error, 
    loading, 
    orders,
    pagination, 
    handlePageChange,
    activeTab,
    setActiveTab: handleTabChange,
    averageRating,
    ...reviewActions 
  };
};

const useReviewOrders = (activeTab: ReviewTab) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  
  const requestIdRef = useRef(0);
  const pageRef = useRef(1);

  const fetchOrders = useCallback(async (page: number = pageRef.current) => {
    const requestId = ++requestIdRef.current;
    
    try {
      const data = await orderService.getUserOrders({ 
        page, 
        limit: 10,
        status: 'COMPLETED',
        has_review: activeTab === 'submitted'
      });
      
      if (requestId === requestIdRef.current) {
        setOrders(data.orders || []);
        if (data.pagination) {
          setPagination(data.pagination);
          pageRef.current = data.pagination.page;
        }
        setError(null);
        setLoading(false);
      }
    } catch {
      if (requestId === requestIdRef.current) {
        setError("Gagal memuat ulasan. Silakan coba lagi.");
        setLoading(false);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    pageRef.current = 1;
    fetchOrders(1);
    
    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchOrders]);

  const handlePageChange = useCallback((page: number) => {
    setLoading(true);
    fetchOrders(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchOrders]);

  return { error, fetchOrders, loading, setLoading, orders, pagination, handlePageChange };
};
