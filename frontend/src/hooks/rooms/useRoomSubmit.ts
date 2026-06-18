import { useCallback, useRef, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { tenantService } from "@/services/tenantService";
import type { RoomFormState } from "./roomsTypes";
import { MAX_ADULT_CAPACITY, MAX_DAILY_PRICE } from "@/constants/validation";

export const useRoomSubmit = (
  propertyId: string | undefined,
  formState: RoomFormState,
  fetchRooms: () => void,
) => {
  const savingRef = useRef(false);
  const [isSavingRoom, setIsSavingRoom] = useState(false);
  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    await submitRoomIfAllowed({ fetchRooms, formState, propertyId, savingRef, setIsSavingRoom });
  }, [fetchRooms, formState, propertyId]);
  return { handleSubmit, isSavingRoom };
};

const submitRoomIfAllowed = async (options: SubmitHandlerOptions) => {
  if (!options.propertyId || options.savingRef.current) return;
  options.savingRef.current = true;
  options.setIsSavingRoom(true);
  try { await saveRoom(options.propertyId, options.formState, options.fetchRooms); }
  finally { options.savingRef.current = false; options.setIsSavingRoom(false); }
};

const saveRoom = async (propertyId: string, state: RoomFormState, fetchRooms: () => void) => {
  try {
    const trimmedForm = { ...state.form, room_type: state.form.room_type.trim() };
    if (!validateRoomForm(trimmedForm)) return;
    if (state.editingRoom) await tenantService.updateRoom(state.editingRoom.id, trimmedForm);
    else await tenantService.createRoom(propertyId, trimmedForm);
    toast.success(state.editingRoom ? "Kamar berhasil diperbarui!" : "Kamar baru berhasil ditambahkan!");
    state.setShowForm(false); state.resetRoomForm(); fetchRooms();
  } catch (err) { toast.error(getApiErrorMessage(err, "Kamar gagal disimpan. Periksa tipe kamar, harga, kapasitas, dan gambar.")); }
};

const validateRoomForm = (form: RoomFormState["form"]) => {
  if (form.room_type.length < 3) return showRoomError("Tipe kamar minimal 3 karakter");
  if (!isIntegerInRange(form.base_price, 1, MAX_DAILY_PRICE)) {
    return showRoomError(`Harga per malam harus antara 1 dan ${MAX_DAILY_PRICE}.`);
  }
  if (form.child_price && !isIntegerInRange(form.child_price, 1, MAX_DAILY_PRICE)) {
    return showRoomError(`Harga anak per malam harus antara 1 dan ${MAX_DAILY_PRICE}.`);
  }
  if (!isIntegerInRange(form.capacity, 1, MAX_ADULT_CAPACITY)) {
    return showRoomError(`Kapasitas dewasa harus antara 1 dan ${MAX_ADULT_CAPACITY}.`);
  }
  if (Number(form.quantity || 1) > 20) return showRoomError("Stok kamar maksimal 20.");
  return true;
};

const isIntegerInRange = (value: string, min: number, max: number) => {
  const number = Number(value);
  return Number.isInteger(number) && number >= min && number <= max;
};

const showRoomError = (message: string) => {
  toast.error(message);
  return false;
};

interface SubmitHandlerOptions {
  fetchRooms: () => void;
  formState: RoomFormState;
  propertyId?: string;
  savingRef: React.MutableRefObject<boolean>;
  setIsSavingRoom: React.Dispatch<React.SetStateAction<boolean>>;
}
