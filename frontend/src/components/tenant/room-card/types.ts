import type { RoomWithPeakRates } from "@/types";

export interface RoomCardProps {
  isWholeUnit: boolean;
  onDelete: (id: string) => void;
  onEdit: (room: RoomWithPeakRates) => void;
  onOpenAvail: (id: string) => void;
  onOpenPeakRates: (id: string) => void;
  room: RoomWithPeakRates;
}
