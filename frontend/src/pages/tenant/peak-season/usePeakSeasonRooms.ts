import { useCallback, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { tenantService } from "@/services/tenantService";
import type { RoomWithPeakRates } from "@/types";
import type { PeakSeasonRoomActions } from "./peakSeasonTypes";

export const usePeakSeasonRooms = (): PeakSeasonRoomActions => {
  const [errorByProperty, setErrorByProperty] = useState<Record<string, string>>({});
  const [expandedPropertyId, setExpandedPropertyId] = useState<string | null>(null);
  const [loadingPropertyId, setLoadingPropertyId] = useState<string | null>(null);
  const [roomsByProperty, setRoomsByProperty] = useState<Record<string, RoomWithPeakRates[]>>({});
  const refreshPropertyRooms = useRefreshRooms(setErrorByProperty, setLoadingPropertyId, setRoomsByProperty);
  const toggleProperty = useToggleProperty(expandedPropertyId, refreshPropertyRooms, roomsByProperty, setExpandedPropertyId);
  return { errorByProperty, expandedPropertyId, getRooms: (id) => roomsByProperty[id] || [], isLoadingRooms: (id) => loadingPropertyId === id, refreshPropertyRooms, toggleProperty };
};

const useRefreshRooms = (
  setError: Dispatch<SetStateAction<Record<string, string>>>,
  setLoading: (id: string | null) => void,
  setRooms: Dispatch<SetStateAction<Record<string, RoomWithPeakRates[]>>>,
) => useCallback(async (propertyId: string) => {
  setLoading(propertyId);
  setError((items) => ({ ...items, [propertyId]: "" }));
  try {
    const rooms = await tenantService.getRooms(propertyId);
    setRooms((items) => ({ ...items, [propertyId]: rooms }));
  }
  catch (err) { setError((items) => ({ ...items, [propertyId]: getApiErrorMessage(err, "Kamar belum bisa dimuat.") })); }
  finally { setLoading(null); }
}, [setError, setLoading, setRooms]);

const useToggleProperty = (
  expandedId: string | null,
  refreshRooms: (propertyId: string) => Promise<void>,
  roomsByProperty: Record<string, RoomWithPeakRates[]>,
  setExpandedId: (id: string | null) => void,
) => useCallback((propertyId: string) => {
  if (expandedId === propertyId) return setExpandedId(null);
  setExpandedId(propertyId);
  if (!roomsByProperty[propertyId]) void refreshRooms(propertyId);
}, [expandedId, refreshRooms, roomsByProperty, setExpandedId]);
