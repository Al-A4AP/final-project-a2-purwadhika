import type { FC } from "react";
import { RoomForm } from "@/components/tenant/RoomForm";
import type { RoomFormInput, RoomWithPeakRates } from "@/types";
import { Modal } from "@/components/common/Modal";

interface RoomsFormSectionProps {
  form: RoomFormInput;
  editingRoom: RoomWithPeakRates | null;
  handleSubmit: (event: React.FormEvent) => void;
  isWholeUnit: boolean;
  setForm: (form: RoomFormInput) => void;
  showForm: boolean;
  fetchRooms: () => void;
  setEditingRoom: (room: RoomWithPeakRates | null) => void;
  onClose: () => void;
}

export const RoomsFormSection: FC<RoomsFormSectionProps> = ({
  form,
  editingRoom,
  handleSubmit,
  isWholeUnit,
  setForm,
  showForm,
  fetchRooms,
  setEditingRoom,
  onClose
}) => (
  <Modal 
    isOpen={showForm} 
    onClose={onClose} 
    title={form.room_type !== "" || editingRoom ? "Edit Kamar" : "Tambah Kamar Baru"}
    maxWidth="2xl"
  >
    <div className="p-6">
      <RoomForm
        isEditing={form.room_type !== "" || Boolean(editingRoom)}
        isWholeUnit={isWholeUnit}
        form={form}
        editingRoom={editingRoom}
        onChange={setForm}
        onSubmit={handleSubmit}
        fetchRooms={fetchRooms}
        setEditingRoom={setEditingRoom}
      />
    </div>
  </Modal>
);
