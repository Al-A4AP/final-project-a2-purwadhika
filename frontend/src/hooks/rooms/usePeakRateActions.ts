import { useCallback, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { tenantService } from "@/services/tenantService";
import type { PeakSeasonRate } from "@/types";
import { hasPeakRateConflict } from "./peakRateConflicts";
import { createEditPeakForm, createEmptyPeakForm } from "./roomFormData";
import type { PeakRateForm, PeakRateSetter, RoomModalState } from "./roomsTypes";

export const usePeakRateActions = (modals: RoomModalState, fetchRooms: () => void) => {
  const [peakRates, setPeakRates] = useState<PeakSeasonRate[]>([]);
  const [peakForm, setPeakForm] = useState<PeakRateForm>(createEmptyPeakForm);
  const [editingPeakRateId, setEditingPeakRateId] = useState<string | null>(null);
  const handleOpenPeakModal = useOpenPeakModal(modals, setPeakRates, setPeakForm);
  const onEditRate = useEditPeakRate(setPeakForm, setEditingPeakRateId);
  const onCancelPeakEdit = useCancelPeakEdit(setPeakForm, setEditingPeakRateId);
  const onSavePeakRate = useSavePeakRate({ editingPeakRateId, fetchRooms, peakForm, peakRates, roomId: modals.selectedRoomId, setEditingPeakRateId, setPeakForm, setPeakRates });
  return { editingPeakRateId, handleOpenPeakModal, onCancelPeakEdit, onEditRate, onSavePeakRate, peakForm, peakRates, setPeakForm, setPeakRates };
};

const useOpenPeakModal = (
  modals: RoomModalState,
  setPeakRates: PeakRateSetter,
  setPeakForm: (form: PeakRateForm) => void,
) => useCallback((roomId: string) => {
  modals.setSelectedRoomId(roomId); modals.setIsPeakModalOpen(true); setPeakForm(createEmptyPeakForm());
  void loadPeakRates(roomId, setPeakRates);
}, [modals, setPeakForm, setPeakRates]);

type SavePeakRateParams = {
  editingPeakRateId: string | null;
  fetchRooms: () => void;
  peakForm: PeakRateForm,
  peakRates: PeakSeasonRate[];
  roomId: string | null;
  setEditingPeakRateId: (id: string | null) => void;
  setPeakRates: PeakRateSetter,
  setPeakForm: (form: PeakRateForm) => void,
};

const useSavePeakRate = (params: SavePeakRateParams) => useCallback((event: FormEvent) => {
  event.preventDefault();
  if (!params.roomId) return toast.error("Kamar belum dipilih.");
  if (hasPeakRateConflict(params.peakRates, params.peakForm, params.editingPeakRateId)) return showPeakConflict();
  void savePeakRate(params);
}, [params]);

const useEditPeakRate = (setPeakForm: (form: PeakRateForm) => void, setEditingId: (id: string | null) => void) =>
  useCallback((rate: PeakSeasonRate) => { setEditingId(rate.id); setPeakForm(createEditPeakForm(rate)); }, [setEditingId, setPeakForm]);

const useCancelPeakEdit = (setPeakForm: (form: PeakRateForm) => void, setEditingId: (id: string | null) => void) =>
  useCallback(() => { setEditingId(null); setPeakForm(createEmptyPeakForm()); }, [setEditingId, setPeakForm]);

const loadPeakRates = async (roomId: string, setPeakRates: PeakRateSetter) => {
  try { setPeakRates(await tenantService.getPeakRates(roomId)); }
  catch (err) { toast.error(getApiErrorMessage(err, "Aturan peak season belum bisa dimuat. Coba buka ulang modal.")); }
};

const savePeakRate = async (params: SavePeakRateParams) => {
  try {
    await persistPeakRate(params);
    await loadPeakRates(params.roomId as string, params.setPeakRates);
    params.setEditingPeakRateId(null); params.setPeakForm(createEmptyPeakForm());
    toast.success(params.editingPeakRateId ? "Peak rate berhasil diperbarui!" : "Peak rate berhasil ditambahkan!");
    params.fetchRooms();
  } catch (err) { toast.error(getApiErrorMessage(err, getPeakRateSaveFallback(params.editingPeakRateId))); }
};

const persistPeakRate = (params: SavePeakRateParams) =>
  params.editingPeakRateId
    ? tenantService.updatePeakRate(params.editingPeakRateId, params.peakForm)
    : tenantService.createPeakRate(params.roomId as string, params.peakForm);

const showPeakConflict = () =>
  toast.error("Rentang peak season bertumpuk. Edit aturan yang sudah ada atau hapus dulu aturan lama.");

const getPeakRateSaveFallback = (editingId: string | null) =>
  editingId
    ? "Peak rate gagal diperbarui. Pastikan tanggal dan nilai tambahan valid."
    : "Peak rate gagal ditambahkan. Pastikan tanggal dan nilai tambahan valid.";
