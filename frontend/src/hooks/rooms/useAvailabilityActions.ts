import { useCallback, useState } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { availabilityService, type RoomAvailability } from "@/services/availabilityService";
import { buildAvailabilityRangeInput, isAvailabilityRangeComplete } from "./availabilityRange";
import { getBlockedDays } from "./roomAvailabilityDates";
import type { AvailabilitySetter, RoomModalState } from "./roomsTypes";

export const useAvailabilityActions = (modals: RoomModalState) => {
  const [availabilities, setAvailabilities] = useState<RoomAvailability[]>([]);
  const [availabilityRange, setAvailabilityRange] = useState<DateRange>();
  const [availabilityIsAvailable, setAvailabilityIsAvailable] = useState(false);
  const [availabilitySaving, setAvailabilitySaving] = useState(false);
  const handleOpenAvailModal = useOpenAvailabilityModal(modals, setAvailabilities, setAvailabilityRange);
  const confirmAvailabilityRange = useConfirmAvailabilityRange({ availabilityIsAvailable, availabilityRange, modals, setAvailabilities, setAvailabilityRange, setAvailabilitySaving });
  return { availabilityIsAvailable, availabilityRange, availabilitySaving, blockedDays: getBlockedDays(availabilities), confirmAvailabilityRange, handleOpenAvailModal, setAvailabilityIsAvailable, setAvailabilityRange };
};

const useOpenAvailabilityModal = (
  modals: RoomModalState,
  setAvailabilities: AvailabilitySetter,
  setAvailabilityRange: (range?: DateRange) => void,
) =>
  useCallback((roomId: string) => {
    modals.setSelectedRoomId(roomId); modals.setIsAvailModalOpen(true); setAvailabilityRange(undefined);
    void loadAvailability(roomId, setAvailabilities);
  }, [modals, setAvailabilities, setAvailabilityRange]);

const loadAvailability = async (roomId: string, setAvailabilities: AvailabilitySetter) => {
  try { setAvailabilities(await availabilityService.getTenantRoomAvailability(roomId)); }
  catch (err) { toast.error(getApiErrorMessage(err, "Ketersediaan kamar belum bisa dimuat. Coba buka ulang modal.")); }
};

type ConfirmRangeParams = {
  availabilityIsAvailable: boolean;
  availabilityRange?: DateRange;
  modals: RoomModalState;
  setAvailabilities: AvailabilitySetter;
  setAvailabilityRange: (range?: DateRange) => void;
  setAvailabilitySaving: (saving: boolean) => void;
};

const useConfirmAvailabilityRange = (params: ConfirmRangeParams) =>
  useCallback(() => {
    if (!params.modals.selectedRoomId || !isAvailabilityRangeComplete(params.availabilityRange)) return toast.error("Pilih tanggal mulai dan tanggal selesai terlebih dahulu.");
    void saveAvailabilityRange(params);
  }, [params]);

const saveAvailabilityRange = async (params: ConfirmRangeParams) => {
  try {
    params.setAvailabilitySaving(true);
    await updateAvailabilityRange(params);
    toast.success(params.availabilityIsAvailable ? "Rentang tanggal dibuka kembali" : "Rentang tanggal ditandai tidak tersedia");
  } catch (err) { toast.error(getApiErrorMessage(err, "Status ketersediaan gagal diperbarui. Coba lagi beberapa saat.")); }
  finally { params.setAvailabilitySaving(false); }
};

const updateAvailabilityRange = async (params: ConfirmRangeParams) => {
  const roomId = params.modals.selectedRoomId as string;
  const payload = buildAvailabilityRangeInput(params.availabilityRange as DateRange, params.availabilityIsAvailable);
  await availabilityService.setRoomAvailabilityRange(roomId, payload);
  await loadAvailability(roomId, params.setAvailabilities);
  params.setAvailabilityRange(undefined);
};
