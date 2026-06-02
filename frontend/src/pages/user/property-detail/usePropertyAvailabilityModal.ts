import { useState } from "react";
import type { Room } from "@/types";

export const usePropertyAvailabilityModal = () => {
  const [isAvailModalOpen, setIsAvailModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const closeAvailabilityModal = () => setIsAvailModalOpen(false);
  const handleCheckAvail = (room: Room) => {
    setSelectedRoomId(room.id);
    setIsAvailModalOpen(true);
  };
  return { closeAvailabilityModal, handleCheckAvail, isAvailModalOpen, selectedRoomId };
};
