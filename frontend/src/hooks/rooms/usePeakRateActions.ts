import { useCallback, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { tenantService } from "@/services/tenantService";
import type { PeakSeasonRate } from "@/types";
import { createEmptyPeakForm } from "./roomFormData";
import type { PeakRateForm, PeakRateSetter, RoomModalState } from "./roomsTypes";

export const usePeakRateActions = (modals: RoomModalState, fetchRooms: () => void) => {
  const [peakRates, setPeakRates] = useState<PeakSeasonRate[]>([]);
  const [peakForm, setPeakForm] = useState<PeakRateForm>(createEmptyPeakForm);
  const handleOpenPeakModal = useOpenPeakModal(modals, setPeakRates, setPeakForm);
  const handleAddPeakRate = useAddPeakRate(modals.selectedRoomId, peakForm, setPeakRates, setPeakForm, fetchRooms);
  return { handleOpenPeakModal, peakRates, setPeakRates, peakForm, setPeakForm, handleAddPeakRate };
};

const useOpenPeakModal = (
  modals: RoomModalState,
  setPeakRates: PeakRateSetter,
  setPeakForm: (form: PeakRateForm) => void,
) => useCallback((roomId: string) => {
  modals.setSelectedRoomId(roomId); modals.setIsPeakModalOpen(true); setPeakForm(createEmptyPeakForm());
  void loadPeakRates(roomId, setPeakRates);
}, [modals, setPeakForm, setPeakRates]);

const useAddPeakRate = (
  roomId: string | null,
  peakForm: PeakRateForm,
  setPeakRates: PeakRateSetter,
  setPeakForm: (form: PeakRateForm) => void,
  fetchRooms: () => void,
) => useCallback((event: FormEvent) => {
  event.preventDefault();
  if (!roomId) return;
  void addPeakRate(roomId, peakForm, setPeakRates, setPeakForm, fetchRooms);
}, [fetchRooms, peakForm, roomId, setPeakForm, setPeakRates]);

const loadPeakRates = async (roomId: string, setPeakRates: PeakRateSetter) => {
  try { setPeakRates(await tenantService.getPeakRates(roomId)); }
  catch (err) { toast.error(getApiErrorMessage(err, "Aturan peak season belum bisa dimuat. Coba buka ulang modal.")); }
};

const addPeakRate = async (
  roomId: string,
  peakForm: PeakRateForm,
  setPeakRates: PeakRateSetter,
  setPeakForm: (form: PeakRateForm) => void,
  fetchRooms: () => void,
) => {
  try {
    await tenantService.createPeakRate(roomId, peakForm);
    await loadPeakRates(roomId, setPeakRates);
    setPeakForm(createEmptyPeakForm()); toast.success("Peak rate berhasil ditambahkan!"); fetchRooms();
  } catch (err) { toast.error(getApiErrorMessage(err, "Peak rate gagal ditambahkan. Pastikan tanggal dan nilai tambahan valid.")); }
};
