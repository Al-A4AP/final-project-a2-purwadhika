import { useEffect, useState, useMemo } from "react";
import { isAfter, parseISO } from "date-fns";
import { useAuthStore } from "@/stores/authStore";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types";

export const useUserDashboardState = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { error, loading, orders } = useDashboardOrders(isAuthenticated);
  const stats = useMemo(() => buildStats(orders), [orders]);
  const upcomingStay = useMemo(() => findUpcomingStay(orders), [orders]);
  const reviewReminders = useMemo(() => getReviewReminders(orders), [orders]);
  const recentOrders = useMemo(() => getRecentOrders(orders), [orders]);
  return { error, loading, orders, recentOrders, reviewReminders, stats, upcomingStay, user };
};

const useDashboardOrders = (isAuthenticated: boolean) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!isAuthenticated) return;
    return loadDashboardOrders({ setError, setLoading, setOrders });
  }, [isAuthenticated]);
  return { error, loading, orders };
};

const loadDashboardOrders = (actions: DashboardOrderActions) => {
  let isMounted = true;
  orderService.getUserOrders({ limit: 50 })
    .then((data) => isMounted && actions.setOrders(data.orders || []))
    .catch(() => isMounted && actions.setError("Gagal memuat data dashboard."))
    .finally(() => isMounted && actions.setLoading(false));
  return () => { isMounted = false; };
};

const buildStats = (orders: Order[]) => ({
  waitingPayment: countByStatus(orders, "WAITING_PAYMENT"),
  waitingConfirmation: countByStatus(orders, "WAITING_CONFIRMATION"),
  confirmed: countByStatus(orders, "PROCESSED"),
  completed: countByStatus(orders, "COMPLETED"),
});

const findUpcomingStay = (orders: Order[]) =>
  getFutureProcessedOrders(orders).sort(sortByCheckInDate)[0] || null;

const getFutureProcessedOrders = (orders: Order[]) => {
  const now = new Date();
  return orders.filter((order) => order.status === "PROCESSED" && isAfter(parseISO(order.check_in_date), now));
};

const getReviewReminders = (orders: Order[]) =>
  orders.filter((order) => order.status === "COMPLETED" && !order.review);

const getRecentOrders = (orders: Order[]) =>
  [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);

const countByStatus = (orders: Order[], status: Order["status"]) =>
  orders.filter((order) => order.status === status).length;

const sortByCheckInDate = (left: Order, right: Order) =>
  parseISO(left.check_in_date).getTime() - parseISO(right.check_in_date).getTime();

interface DashboardOrderActions {
  setError: (value: string | null) => void;
  setLoading: (value: boolean) => void;
  setOrders: (value: Order[]) => void;
}
