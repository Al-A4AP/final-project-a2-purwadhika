import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { availabilityService, type RoomAvailability } from "@/services/availabilityService";
import { findAvailabilityForDate, getBlockedDays, getDateKey } from "./roomAvailabilityDates";
import { getApiErrorMessage } from "./roomError";
import type { AvailabilitySetter, RoomModalState } from "./roomsTypes";

export const useAvailabilityActions = (modals: RoomModalState) => {
  const [availabilities, setAvailabilities] = useState<RoomAvailability[]>([]);
  const handleOpenAvailModal = useOpenAvailabilityModal(modals, setAvailabilities);
  const handleDayClick = useDayClick(modals.selectedRoomId, availabilities, setAvailabilities);
  return { handleOpenAvailModal, handleDayClick, blockedDays: getBlockedDays(availabilities) };
};

const useOpenAvailabilityModal = (modals: RoomModalState, setAvailabilities: AvailabilitySetter) =>
  useCallback((roomId: string) => {
    modals.setSelectedRoomId(roomId); modals.setIsAvailModalOpen(true);
    void loadAvailability(roomId, setAvailabilities);
  }, [modals, setAvailabilities]);

const loadAvailability = async (roomId: string, setAvailabilities: AvailabilitySetter) => {
  try { setAvailabilities(await availabilityService.getTenantRoomAvailability(roomId)); }
  catch { toast.error("Gagal memuat ketersediaan kamar"); }
};

const useDayClick = (
  roomId: string | null,
  availabilities: RoomAvailability[],
  setAvailabilities: AvailabilitySetter,
) => useCallback((date: Date) => {
  if (!roomId) return;
  void toggleAvailability(roomId, date, availabilities, setAvailabilities);
}, [availabilities, roomId, setAvailabilities]);

const toggleAvailability = async (
  roomId: string,
  date: Date,
  availabilities: RoomAvailability[],
  setAvailabilities: AvailabilitySetter,
) => {
  try {
    const existing = findAvailabilityForDate(availabilities, date);
    await availabilityService.setRoomAvailability(roomId, getDateKey(date), existing ? !existing.is_available : false);
    await loadAvailability(roomId, setAvailabilities);
    toast.success("Status ketersediaan diubah");
  } catch (err) { toast.error(getApiErrorMessage(err, "Gagal mengupdate")); }
};
