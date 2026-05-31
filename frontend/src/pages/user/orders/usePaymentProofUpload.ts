import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types";

export const usePaymentProofUpload = (orders: Order[], refetch: () => void) => {
  const [uploading, setUploading] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleUploadClick = (orderId: string) => { setSelectedOrderId(orderId); fileInputRef.current?.click(); };
  const handleFileChange = useFileChangeHandler(orders, selectedOrderId, refetch, setUploading, setSelectedOrderId, fileInputRef);
  return { fileInputRef, handleFileChange, handleUploadClick, uploading };
};

const useFileChangeHandler = (
  orders: Order[],
  selectedOrderId: string | null,
  refetch: () => void,
  setUploading: (value: string | null) => void,
  setSelectedOrderId: (value: string | null) => void,
  fileInputRef: React.RefObject<HTMLInputElement | null>,
) => async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file || !selectedOrderId) return;
  const order = orders.find((item) => item.id === selectedOrderId);
  if (!order || !canUploadProof(order)) return;
  await uploadPaymentProof(selectedOrderId, file, refetch, setUploading);
  resetFileSelection(fileInputRef, setSelectedOrderId);
};

const canUploadProof = (order: Order) => {
  if (order.status === "WAITING_PAYMENT") return true;
  toast.error("Bukti pembayaran hanya dapat diunggah untuk pesanan yang menunggu pembayaran.");
  return false;
};

const uploadPaymentProof = async (
  orderId: string,
  file: File,
  refetch: () => void,
  setUploading: (value: string | null) => void,
) => {
  setUploading(orderId);
  try { await orderService.uploadPaymentProof(orderId, file); toast.success("Bukti pembayaran berhasil diunggah! Menunggu konfirmasi."); refetch(); }
  catch { toast.error("Gagal mengunggah bukti pembayaran"); }
  finally { setUploading(null); }
};

const resetFileSelection = (
  fileInputRef: React.RefObject<HTMLInputElement | null>,
  setSelectedOrderId: (value: string | null) => void,
) => {
  setSelectedOrderId(null);
  if (fileInputRef.current) fileInputRef.current.value = "";
};
