import { useState } from "react";
import { toast } from "react-hot-toast";
import { availabilityService } from "@/services/availabilityService";
import { getApiErrorMessage } from "@/lib/errorMessage";
import type { Room } from "@/types";

const getBlockedDays = async (roomId: string) => {
  const data = await availabilityService.getRoomAvailability(roomId);
  return data.filter((availability) => !availability.is_available).map((availability) => new Date(availability.date));
};

export const usePropertyAvailabilityModal = () => {
  const [blockedDays, setBlockedDays] = useState<Date[]>([]);
  const [isAvailModalOpen, setIsAvailModalOpen] = useState(false);
  const [selectedRoomName, setSelectedRoomName] = useState("");
  const closeAvailabilityModal = () => setIsAvailModalOpen(false);
  const handleCheckAvail = async (room: Room) => {
    setSelectedRoomName(room.room_type);
    try { setBlockedDays(await getBlockedDays(room.id)); setIsAvailModalOpen(true); }
    catch (err) { toast.error(getApiErrorMessage(err, "Ketersediaan kamar belum bisa dimuat. Coba lagi beberapa saat.")); }
  };
  return { blockedDays, closeAvailabilityModal, handleCheckAvail, isAvailModalOpen, selectedRoomName };
};
