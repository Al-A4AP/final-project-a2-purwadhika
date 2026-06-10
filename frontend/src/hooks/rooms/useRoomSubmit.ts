import { useCallback } from "react";
import type { FormEvent } from "react";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { tenantService } from "@/services/tenantService";
import type { RoomFormState } from "./roomsTypes";

export const useRoomSubmit = (
  propertyId: string | undefined,
  formState: RoomFormState,
  fetchRooms: () => void,
) => {
  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    if (!propertyId) return;
    await saveRoom(propertyId, formState, fetchRooms);
  }, [fetchRooms, formState, propertyId]);
  return { handleSubmit };
};

const saveRoom = async (propertyId: string, state: RoomFormState, fetchRooms: () => void) => {
  try {
    const trimmedForm = { ...state.form, room_type: state.form.room_type.trim() };
    if (trimmedForm.room_type.length < 3) {
      toast.error("Tipe kamar minimal 3 karakter");
      return;
    }
    if (state.editingRoom) await tenantService.updateRoom(state.editingRoom.id, trimmedForm);
    else await tenantService.createRoom(propertyId, trimmedForm);
    toast.success(state.editingRoom ? "Kamar berhasil diperbarui!" : "Kamar baru berhasil ditambahkan!");
    state.setShowForm(false); state.resetRoomForm(); fetchRooms();
  } catch (err) { toast.error(getApiErrorMessage(err, "Kamar gagal disimpan. Periksa tipe kamar, harga, kapasitas, dan gambar.")); }
};
