import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types";
import { useUserOrdersPageState } from "./useUserOrdersPageState";

export const useBookingDetailState = () => {
  const { id } = useParams<{ id: string }>();
  const userOrdersState = useUserOrdersPageState();
  const detail = useBookingDetailOrder(id);
  return { ...detail, state: userOrdersState.state, fileInputRef: userOrdersState.fileInputRef };
};

const useBookingDetailOrder = (id: string | undefined) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return markMissingOrder(setError, setLoading);
    return loadBookingDetail(id, { setError, setLoading, setOrder });
  }, [id]);

  return { error, loading, order };
};

const loadBookingDetail = (id: string, setters: BookingDetailSetters) => {
  let isMounted = true;
  setters.setLoading(true);
  orderService.getUserOrderById(id)
    .then((order) => {
      if (isMounted) setters.setOrder(order);
    })
    .catch(() => isMounted && setters.setError("Pesanan tidak ditemukan atau Anda tidak memiliki akses."))
    .finally(() => isMounted && setters.setLoading(false));
  return () => { isMounted = false; };
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
