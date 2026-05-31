import { useState } from "react";
import { toast } from "react-hot-toast";
import { tenantService } from "@/services/tenantService";
import { getApiErrorMessage } from "@/lib/errorMessage";
import type { PeakSeasonRate } from "@/types";

interface DeleteActionOptions {
  fetchRooms: () => void;
  selectedRoomId: string | null;
  setPeakRates: (rates: PeakSeasonRate[]) => void;
}

const initialConfirmModal = { isOpen: false, message: "", onConfirm: () => {}, title: "" };

const deleteRoom = async (roomId: string, fetchRooms: () => void) => {
  try { await tenantService.deleteRoom(roomId); toast.success("Kamar berhasil dihapus"); fetchRooms(); }
  catch (err) { toast.error(getApiErrorMessage(err, "Kamar gagal dihapus. Pastikan tidak ada pesanan aktif untuk kamar ini.")); }
};

const deletePeakRate = async (rateId: string, options: DeleteActionOptions) => {
  try {
    await tenantService.deletePeakRate(rateId);
    if (options.selectedRoomId) options.setPeakRates(await tenantService.getPeakRates(options.selectedRoomId));
    toast.success("Peak rate berhasil dihapus");
    options.fetchRooms();
  } catch (err) { toast.error(getApiErrorMessage(err, "Peak rate gagal dihapus. Coba muat ulang data kamar lalu ulangi.")); }
};

export const useRoomDeleteActions = (options: DeleteActionOptions) => {
  const [confirmModal, setConfirmModal] = useState(initialConfirmModal);
  const closeConfirmModal = () => setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  const handleDelete = (roomId: string) => setConfirmModal({
    isOpen: true, message: "Apakah Anda yakin ingin menghapus kamar ini?", title: "Hapus Kamar",
    onConfirm: async () => { await deleteRoom(roomId, options.fetchRooms); closeConfirmModal(); },
  });
  const handleDeletePeakRate = (rateId: string) => setConfirmModal({
    isOpen: true, message: "Hapus aturan peak rate ini?", title: "Hapus Peak Rate",
    onConfirm: async () => { await deletePeakRate(rateId, options); closeConfirmModal(); },
  });
  return { closeConfirmModal, confirmModal, handleDelete, handleDeletePeakRate };
};
