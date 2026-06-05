import { useState } from "react";
import { toast } from "react-hot-toast";
import { tenantService } from "@/services/tenantService";
import { getApiErrorMessage } from "@/lib/errorMessage";
import type { TenantProperty } from "@/types";

const initialConfirmModal = { isOpen: false, message: "", onConfirm: () => {}, title: "" };
const removeProperty = (id: string, properties: TenantProperty[]) => properties.filter((property) => property.id !== id);
const createDeleteModal = (name: string, onConfirm: () => void) => ({
  isOpen: true,
  message: `Hapus properti "${name}"? Tindakan ini tidak dapat dibatalkan dan semua kamar serta peak rate di dalamnya akan ikut terhapus.`,
  title: "Hapus Properti",
  onConfirm,
});

export const usePropertyDeleteConfirm = (properties: TenantProperty[], setProperties: (properties: TenantProperty[]) => void) => {
  const [confirmModal, setConfirmModal] = useState(initialConfirmModal);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const closeConfirmModal = () => setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  const confirmDelete = async (id: string, name: string) => {
    setDeletingId(id);
    await deleteProperty(id, name, properties, setProperties);
    setDeletingId(null);
    closeConfirmModal();
  };
  const handleDelete = (id: string, name: string) => setConfirmModal(createDeleteModal(name, () => confirmDelete(id, name)));
  return { closeConfirmModal, confirmModal, deletingId, handleDelete };
};

const deleteProperty = async (id: string, name: string, properties: TenantProperty[], setProperties: (properties: TenantProperty[]) => void) => {
  try {
    await tenantService.deleteProperty(id);
    setProperties(removeProperty(id, properties));
    toast.success("Properti berhasil dihapus");
  } catch (err) { toast.error(getApiErrorMessage(err, `Properti "${name}" gagal dihapus. Pastikan tidak ada pesanan aktif.`)); }
};
