import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { tenantService } from "@/services/tenantService";
import type { RoomWithPeakRates, TenantPropertyDetail } from "@/types";

export const useRoomsData = (id?: string) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomWithPeakRates[]>([]);
  const [property, setProperty] = useState<TenantPropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchRooms = useCallback(() => { void loadRooms(id, navigate, setRooms, setProperty, setLoading); }, [id, navigate]);
  useEffect(() => { fetchRooms(); }, [fetchRooms]);
  return { rooms, property, loading, fetchRooms };
};

const loadRooms = async (id: string | undefined, navigate: ReturnType<typeof useNavigate>, setRooms: (rooms: RoomWithPeakRates[]) => void, setProperty: (property: TenantPropertyDetail) => void, setLoading: (loading: boolean) => void) => {
  if (!id) return;
  try {
    const [roomsData, propData] = await Promise.all([tenantService.getRooms(id), tenantService.getProperty(id)]);
    setRooms(roomsData); setProperty(propData);
  } catch (err) {
    toast.error(getApiErrorMessage(err, "Properti tidak ditemukan atau Anda tidak memiliki akses ke data kamar."));
    navigate("/tenant/properties");
  } finally { setLoading(false); }
};
