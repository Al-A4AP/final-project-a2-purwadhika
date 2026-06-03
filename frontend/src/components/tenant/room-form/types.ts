import type { FormEvent } from "react";
import type { RoomFormInput, RoomWithPeakRates } from "@/types";

export interface RoomFormProps {
  form: RoomFormInput;
  isEditing: boolean;
  isWholeUnit: boolean;
  editingRoom?: RoomWithPeakRates | null;
  onChange: (form: RoomFormInput) => void;
  onSubmit: (event: FormEvent) => void;
  fetchRooms: () => void;
  setEditingRoom: (room: RoomWithPeakRates | null) => void;
}

export type RoomFormFieldName = keyof RoomFormInput;
