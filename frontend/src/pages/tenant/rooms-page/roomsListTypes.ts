import type { RoomWithPeakRates } from "@/types";

export interface RoomsListViewProps {
  handleEdit: (room: RoomWithPeakRates) => void;
  handleOpenAvailModal: (id: string) => void;
  isWholeUnit: boolean;
  onDelete: (id: string) => void;
  rooms: RoomWithPeakRates[];
}

export interface RoomOnlyProps {
  isWholeUnit: boolean;
  room: RoomWithPeakRates;
}

export interface RoomItemProps extends RoomOnlyProps {
  handleEdit: (room: RoomWithPeakRates) => void;
  handleOpenAvailModal: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface RoomActionProps {
  room: RoomWithPeakRates;
  handleEdit?: (room: RoomWithPeakRates) => void;
  handleOpenAvailModal?: (id: string) => void;
  onDelete?: (id: string) => void;
}
