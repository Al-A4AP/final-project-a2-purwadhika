import { useState } from "react";
import type { RoomModalState } from "./roomsTypes";

export const useRoomModals = (): RoomModalState => {
  const [isAvailModalOpen, setIsAvailModalOpen] = useState(false);
  const [isPeakModalOpen, setIsPeakModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  return { isAvailModalOpen, setIsAvailModalOpen, isPeakModalOpen, setIsPeakModalOpen, selectedRoomId, setSelectedRoomId };
};
