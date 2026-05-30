import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { tenantService } from "@/services/tenantService";
import { availabilityService, type RoomAvailability } from "@/services/availabilityService";
import type { RoomWithPeakRates, PeakSeasonRate, RoomFormInput, TenantPropertyDetail } from "@/types";

export const useRoomsLogic = (id?: string) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomWithPeakRates[]>([]);
  const [property, setProperty] = useState<TenantPropertyDetail | null>(null);
  const [availabilities, setAvailabilities] = useState<RoomAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isAvailModalOpen, setIsAvailModalOpen] = useState(false);
  const [isPeakModalOpen, setIsPeakModalOpen] = useState(false);
  const [peakRates, setPeakRates] = useState<PeakSeasonRate[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [editingRoom, setEditingRoom] = useState<RoomWithPeakRates | null>(null);
  const [form, setForm] = useState<RoomFormInput>({
    room_type: "", base_price: "", child_price: "", capacity: "", quantity: "1", description: "", image: null,
  });
  const [peakForm, setPeakForm] = useState({
    start_date: "", end_date: "", rate_type: "PERCENTAGE", rate_value: "", description: "",
  });

  const fetchRooms = useCallback(() => {
    if (!id) return;
    Promise.all([tenantService.getRooms(id), tenantService.getProperty(id)])
      .then(([roomsData, propData]) => { setRooms(roomsData); setProperty(propData); })
      .catch((err: unknown) => {
        const e = err as { response?: { data?: { message?: string } } };
        toast.error(e.response?.data?.message || "Properti tidak ditemukan");
        navigate("/tenant/properties");
      }).finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      if (editingRoom) {
        await tenantService.updateRoom(editingRoom.id, form);
        toast.success("Kamar berhasil diperbarui!");
      } else {
        await tenantService.createRoom(id, form);
        toast.success("Kamar baru berhasil ditambahkan!");
      }
      setShowForm(false);
      setEditingRoom(null);
      setForm({ room_type: "", base_price: "", child_price: "", capacity: "", quantity: "1", description: "", image: null });
      fetchRooms();
    } catch { toast.error("Gagal menyimpan kamar"); }
  };

  const handleOpenAvailModal = async (roomId: string) => {
    setSelectedRoomId(roomId); setIsAvailModalOpen(true);
    try {
      const data = await availabilityService.getTenantRoomAvailability(roomId);
      setAvailabilities(data);
    } catch { toast.error("Gagal memuat ketersediaan kamar"); }
  };

  const handleOpenPeakModal = async (roomId: string) => {
    setSelectedRoomId(roomId); setIsPeakModalOpen(true);
    setPeakForm({ start_date: "", end_date: "", rate_type: "PERCENTAGE", rate_value: "", description: "" });
    try {
      const data = await tenantService.getPeakRates(roomId);
      setPeakRates(data);
    } catch { toast.error("Gagal memuat aturan peak season"); }
  };

  const handleAddPeakRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId) return;
    try {
      await tenantService.createPeakRate(selectedRoomId, peakForm);
      const data = await tenantService.getPeakRates(selectedRoomId);
      setPeakRates(data);
      setPeakForm({ start_date: "", end_date: "", rate_type: "PERCENTAGE", rate_value: "", description: "" });
      toast.success("Peak rate berhasil ditambahkan!");
      fetchRooms();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || "Gagal");
    }
  };

  const handleDayClick = async (date: Date) => {
    if (!selectedRoomId) return;
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const dateStr = startOfDay.toISOString().split("T")[0];
    const existing = availabilities.find((a) => {
      const [year, month, day] = a.date.split("-");
      const dateUtc = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
      return dateUtc.getTime() === startOfDay.getTime();
    });
    const newIsAvailable = existing ? !existing.is_available : false;
    try {
      await availabilityService.setRoomAvailability(selectedRoomId, dateStr, newIsAvailable);
      const data = await availabilityService.getTenantRoomAvailability(selectedRoomId);
      setAvailabilities(data);
      toast.success("Status ketersediaan diubah");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || "Gagal mengupdate");
    }
  };

  const blockedDays = availabilities.filter((a) => !a.is_available).map((a) => {
    const [year, month, day] = a.date.split("-");
    return new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
  });

  const handleEdit = (room: RoomWithPeakRates) => {
    setEditingRoom(room);
    setForm({
      room_type: room.room_type, base_price: String(room.base_price),
      child_price: room.child_price != null ? String(room.child_price) : "",
      capacity: String(room.capacity), quantity: String(room.quantity || 1), description: room.description || "", image: null,
    });
    setShowForm(true);
  };

  return {
    rooms, property, loading, showForm, setShowForm, form, setForm, handleSubmit, handleEdit,
    isAvailModalOpen, setIsAvailModalOpen, handleOpenAvailModal, handleDayClick, blockedDays,
    isPeakModalOpen, setIsPeakModalOpen, handleOpenPeakModal, peakRates, setPeakRates,
    peakForm, setPeakForm, handleAddPeakRate, selectedRoomId, fetchRooms, editingRoom, setEditingRoom
  };
};
