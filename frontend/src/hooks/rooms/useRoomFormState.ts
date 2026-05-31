import { useState } from "react";
import type { RoomWithPeakRates } from "@/types";
import { createEditRoomForm, createEmptyRoomForm } from "./roomFormData";
import type { RoomFormState } from "./roomsTypes";

export const useRoomFormState = (): RoomFormState => {
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomWithPeakRates | null>(null);
  const [form, setForm] = useState(createEmptyRoomForm);
  const resetRoomForm = () => { setForm(createEmptyRoomForm()); setEditingRoom(null); };
  const handleEdit = (room: RoomWithPeakRates) => { setEditingRoom(room); setForm(createEditRoomForm(room)); setShowForm(true); };
  return { showForm, setShowForm, editingRoom, setEditingRoom, form, setForm, resetRoomForm, handleEdit };
};
