import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types";
import { useUserOrdersPageState } from "./useUserOrdersPageState";

export const useBookingDetailState = () => {
  const { id } = useParams<{ id: string }>();
  const userOrdersState = useUserOrdersPageState();
  const detail = useBookingDetailOrder(id, userOrdersState.state.orders);
  return { ...detail, state: userOrdersState.state, fileInputRef: userOrdersState.fileInputRef };
};

const useBookingDetailOrder = (id: string | undefined, orders: Order[]) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return markMissingOrder(setError, setLoading);
    return loadBookingDetail(id, { setError, setLoading, setOrder });
  }, [id, orders]);

  return { error, loading, order };
};

const loadBookingDetail = (id: string, setters: BookingDetailSetters) => {
  let isMounted = true;
  setters.setLoading(true);
  orderService.getUserOrders({ limit: 100 })
    .then((data) => updateFoundOrder(id, data.orders, setters, isMounted))
    .catch(() => isMounted && setters.setError("Gagal memuat detail pesanan."))
    .finally(() => isMounted && setters.setLoading(false));
  return () => { isMounted = false; };
};

const updateFoundOrder = (id: string, orders: Order[], setters: BookingDetailSetters, isMounted: boolean) => {
  if (!isMounted) return;
  const found = orders.find((item) => item.id === id);
  if (found) return setters.setOrder(found);
  setters.setError("Pesanan tidak ditemukan atau Anda tidak memiliki akses.");
};

const markMissingOrder = (
  setError: (value: string | null) => void,
  setLoading: (value: boolean) => void,
) => {
  setError("Pesanan tidak ditemukan.");
  setLoading(false);
};

interface BookingDetailSetters {
  setError: (value: string | null) => void;
  setLoading: (value: boolean) => void;
  setOrder: (value: Order | null) => void;
}
