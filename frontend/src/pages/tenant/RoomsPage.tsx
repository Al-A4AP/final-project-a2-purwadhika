import type { FC } from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";
import { tenantService } from "@/services/tenantService";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { toast } from "react-hot-toast";

import { RoomCard } from "@/components/tenant/RoomCard";
import { RoomForm } from "@/components/tenant/RoomForm";
import { RoomAvailabilityModal } from "@/components/tenant/RoomAvailabilityModal";
import { RoomPeakRatesModal } from "@/components/tenant/RoomPeakRatesModal";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { HelpText } from "@/components/common/HelpText";
import { useRoomsLogic } from "@/hooks/useRoomsLogic";

const RoomsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    rooms, property, loading, showForm, setShowForm, form, setForm, handleSubmit, handleEdit,
    isAvailModalOpen, setIsAvailModalOpen, handleOpenAvailModal, handleDayClick, blockedDays,
    isPeakModalOpen, setIsPeakModalOpen, handleOpenPeakModal, peakRates, setPeakRates,
    peakForm, setPeakForm, handleAddPeakRate, selectedRoomId, fetchRooms, setEditingRoom
  } = useRoomsLogic(id);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, title: "", message: "", onConfirm: () => {},
  });

  const handleDelete = (roomId: string) => {
    setConfirmModal({
      isOpen: true, title: "Hapus Kamar", message: "Apakah Anda yakin ingin menghapus kamar ini?",
      onConfirm: async () => {
        try {
          await tenantService.deleteRoom(roomId);
          toast.success("Kamar berhasil dihapus");
          fetchRooms();
        } catch (err) { toast.error(getApiErrorMessage(err, "Kamar gagal dihapus. Pastikan tidak ada pesanan aktif untuk kamar ini.")); }
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDeletePeakRate = (rateId: string) => {
    setConfirmModal({
      isOpen: true, title: "Hapus Peak Rate", message: "Hapus aturan peak rate ini?",
      onConfirm: async () => {
        try {
          await tenantService.deletePeakRate(rateId);
          if (selectedRoomId) {
            const data = await tenantService.getPeakRates(selectedRoomId);
            setPeakRates(data);
          }
          toast.success("Peak rate berhasil dihapus");
          fetchRooms();
        } catch (err) { toast.error(getApiErrorMessage(err, "Peak rate gagal dihapus. Coba muat ulang data kamar lalu ulangi.")); }
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const isWholeUnit = ["Villa", "Rumah"].includes(property?.category?.name || "");

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/tenant/properties")} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Kamar</h1>
      </div>
      <HelpText>Kamar membutuhkan harga, kapasitas, dan minimal satu foto agar properti siap dipesan oleh user.</HelpText>

      {!isWholeUnit && (
        <button
          onClick={() => {
            setShowForm(!showForm); setEditingRoom(null);
            setForm({ room_type: "", base_price: "", child_price: "", capacity: "", quantity: "1", description: "", image: null });
          }}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
        >
          <Plus size={16} /> {showForm ? "Batal" : "Tambah Kamar"}
        </button>
      )}

      {showForm && <RoomForm isEditing={form.room_type !== ""} form={form} onChange={setForm} onSubmit={handleSubmit} />}

      {loading ? (
        <div className="h-32 bg-gray-200 dark:bg-slate-700 animate-pulse rounded-xl" />
      ) : (
        <div className="space-y-3">
          {rooms.length === 0 ? (
            <p className="text-gray-500 text-sm">Belum ada kamar. Tambahkan kamar pertama.</p>
          ) : (
            rooms.map((r) => (
              <RoomCard
                key={r.id} room={r} onDelete={handleDelete} onEdit={handleEdit}
                onOpenAvail={handleOpenAvailModal} onOpenPeakRates={handleOpenPeakModal}
              />
            ))
          )}
        </div>
      )}

      <RoomAvailabilityModal isOpen={isAvailModalOpen} blockedDays={blockedDays} onDayClick={handleDayClick} onClose={() => setIsAvailModalOpen(false)} />
      <RoomPeakRatesModal isOpen={isPeakModalOpen} peakRates={peakRates} peakForm={peakForm} onFormChange={setPeakForm} onAddRate={handleAddPeakRate} onDeleteRate={handleDeletePeakRate} onClose={() => setIsPeakModalOpen(false)} />
      <ConfirmModal isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message} onConfirm={confirmModal.onConfirm} onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))} />
    </div>
  );
};

export default RoomsPage;
