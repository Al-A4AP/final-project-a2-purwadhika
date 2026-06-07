import { useCallback, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { tenantService } from "@/services/tenantService";
import type { PeakSeasonRate, RoomWithPeakRates } from "@/types";
import type { PeakRateFormData } from "@/components/tenant/peak-rates/peakRateTypes";
import { hasPeakRateConflict } from "@/hooks/rooms/peakRateConflicts";
import { createEditPeakForm, createEmptyPeakForm } from "@/hooks/rooms/roomFormData";
import type { PeakSeasonRateModalState } from "./peakSeasonTypes";

export const usePeakSeasonRateModal = (refreshRooms: (propertyId: string) => Promise<void>): PeakSeasonRateModalState => {
  const [editingRateId, setEditingRateId] = useState<string | null>(null);
  const [peakForm, setPeakForm] = useState<PeakRateFormData>(createEmptyPeakForm);
  const [peakRates, setPeakRates] = useState<PeakSeasonRate[]>([]);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [selection, setSelection] = useState<PeakSelection | null>(null);
  const open = useOpenRateModal(setEditingRateId, setPeakForm, setPeakRates, setSelection);
  const close = useCallback(() => { setSelection(null); setPendingDeleteId(null); }, []);
  const onEditRate = useCallback((rate: PeakSeasonRate) => { setEditingRateId(rate.id); setPeakForm(createEditPeakForm(rate)); }, []);
  const onCancelEdit = useCallback(() => { setEditingRateId(null); setPeakForm(createEmptyPeakForm()); }, []);
  const onSaveRate = useSaveRate({ editingRateId, peakForm, peakRates, refreshRooms, selection, setEditingRateId, setPeakForm, setPeakRates });
  const confirmDelete = useDeleteRate({ pendingDeleteId, refreshRooms, selection, setPeakRates, setPendingDeleteId });
  return { close, confirmDelete, editingRateId, isOpen: Boolean(selection), onCancelEdit, onDeleteRate: setPendingDeleteId, onEditRate, onFormChange: setPeakForm, onSaveRate, open, peakForm, peakRates, pendingDeleteId, roomLabel: selection?.room.room_type || "", selectedRoomId: selection?.room.id || null };
};

const useOpenRateModal = (
  setEditingId: (id: string | null) => void,
  setForm: (form: PeakRateFormData) => void,
  setRates: (rates: PeakSeasonRate[]) => void,
  setSelection: (selection: PeakSelection) => void,
) => useCallback((room: RoomWithPeakRates, propertyId: string) => {
  setEditingId(null);
  setForm(createEmptyPeakForm());
  setSelection({ propertyId, room });
  void loadPeakRates(room.id, setRates);
}, [setEditingId, setForm, setRates, setSelection]);

const useSaveRate = (params: SaveRateParams) => useCallback((event: FormEvent) => {
  event.preventDefault();
  if (!params.selection) return toast.error("Kamar belum dipilih.");
  if (hasPeakRateConflict(params.peakRates, params.peakForm, params.editingRateId)) return showConflict();
  void saveRate(params);
}, [params]);

const saveRate = async (params: SaveRateParams) => {
  try {
    await persistRate(params);
    await reloadAfterMutation(params);
    toast.success(params.editingRateId ? "Harga musiman diperbarui." : "Harga musiman ditambahkan.");
  } catch (err) { toast.error(getApiErrorMessage(err, "Harga musiman belum bisa disimpan.")); }
};

const persistRate = (params: SaveRateParams) =>
  params.editingRateId
    ? tenantService.updatePeakRate(params.editingRateId, params.peakForm)
    : tenantService.createPeakRate(params.selection!.room.id, params.peakForm);

const reloadAfterMutation = async (params: SaveRateParams) => {
  params.setPeakRates(await tenantService.getPeakRates(params.selection!.room.id));
  params.setEditingRateId(null);
  params.setPeakForm(createEmptyPeakForm());
  await params.refreshRooms(params.selection!.propertyId);
};

const useDeleteRate = (params: DeleteRateParams) => useCallback(async () => {
  if (!params.pendingDeleteId || !params.selection) return;
  await deleteRate(params);
}, [params]);

const deleteRate = async (params: DeleteRateParams) => {
  try {
    await tenantService.deletePeakRate(params.pendingDeleteId as string);
    params.setPeakRates(await tenantService.getPeakRates(params.selection!.room.id));
    params.setPendingDeleteId(null);
    await params.refreshRooms(params.selection!.propertyId);
    toast.success("Harga musiman dihapus.");
  } catch (err) { toast.error(getApiErrorMessage(err, "Harga musiman belum bisa dihapus.")); }
};

const loadPeakRates = async (roomId: string, setRates: (rates: PeakSeasonRate[]) => void) => {
  try { setRates(await tenantService.getPeakRates(roomId)); }
  catch (err) { toast.error(getApiErrorMessage(err, "Harga musiman belum bisa dimuat.")); }
};

const showConflict = () =>
  toast.error("Rentang tanggal bertumpuk. Edit aturan yang sudah ada atau hapus terlebih dahulu.");

interface PeakSelection {
  propertyId: string;
  room: RoomWithPeakRates;
}

interface SaveRateParams {
  editingRateId: string | null;
  peakForm: PeakRateFormData;
  peakRates: PeakSeasonRate[];
  refreshRooms: (propertyId: string) => Promise<void>;
  selection: PeakSelection | null;
  setEditingRateId: (id: string | null) => void;
  setPeakForm: (form: PeakRateFormData) => void;
  setPeakRates: (rates: PeakSeasonRate[]) => void;
}

interface DeleteRateParams {
  pendingDeleteId: string | null;
  refreshRooms: (propertyId: string) => Promise<void>;
  selection: PeakSelection | null;
  setPeakRates: (rates: PeakSeasonRate[]) => void;
  setPendingDeleteId: (id: string | null) => void;
}
