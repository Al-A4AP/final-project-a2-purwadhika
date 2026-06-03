import type { FC } from "react";
import { RoomForm } from "@/components/tenant/RoomForm";
import type { RoomFormInput, RoomWithPeakRates } from "@/types";

interface RoomsFormSectionProps {
  form: RoomFormInput;
  editingRoom: RoomWithPeakRates | null;
  handleSubmit: (event: React.FormEvent) => void;
  isWholeUnit: boolean;
  setForm: (form: RoomFormInput) => void;
  showForm: boolean;
  fetchRooms: () => void;
  setEditingRoom: (room: RoomWithPeakRates | null) => void;
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
}) => (
  showForm ? (
    <RoomForm
      isEditing={form.room_type !== ""}
      isWholeUnit={isWholeUnit}
      form={form}
      editingRoom={editingRoom}
      onChange={setForm}
      onSubmit={handleSubmit}
      fetchRooms={fetchRooms}
      setEditingRoom={setEditingRoom}
    />
  ) : null
);
