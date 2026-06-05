import { usePeakSeasonFilters } from "./usePeakSeasonFilters";
import { usePeakSeasonProperties } from "./usePeakSeasonProperties";
import { usePeakSeasonRateModal } from "./usePeakSeasonRateModal";
import { usePeakSeasonRooms } from "./usePeakSeasonRooms";
import type { PeakSeasonPageState } from "./peakSeasonTypes";

export const usePeakSeasonPageState = (): PeakSeasonPageState => {
  const filters = usePeakSeasonFilters();
  const properties = usePeakSeasonProperties(filters.params);
  const roomActions = usePeakSeasonRooms();
  const modal = usePeakSeasonRateModal(roomActions.refreshPropertyRooms);
  return { ...properties, filters: filters.filters, modal, propertyActions: filters.actions, roomActions };
};
