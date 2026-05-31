import { useAvailabilityActions } from "./rooms/useAvailabilityActions";
import { usePeakRateActions } from "./rooms/usePeakRateActions";
import { useRoomFormState } from "./rooms/useRoomFormState";
import { useRoomModals } from "./rooms/useRoomModals";
import { useRoomSubmit } from "./rooms/useRoomSubmit";
import { useRoomsData } from "./rooms/useRoomsData";

export const useRoomsLogic = (id?: string) => {
  const data = useRoomsData(id);
  const form = useRoomFormState();
  const modals = useRoomModals();
  const submit = useRoomSubmit(id, form, data.fetchRooms);
  const availability = useAvailabilityActions(modals);
  const peakRates = usePeakRateActions(modals, data.fetchRooms);
  return { ...data, ...form, ...submit, ...modals, ...availability, ...peakRates };
};
