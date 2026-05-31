import type { FC } from "react";
import { RoomCard } from "@/components/tenant/RoomCard";
import type { RoomWithPeakRates } from "@/types";

interface RoomsListSectionProps {
  handleEdit: (room: RoomWithPeakRates) => void;
  handleOpenAvailModal: (id: string) => void;
  handleOpenPeakModal: (id: string) => void;
  loading: boolean;
  onDelete: (id: string) => void;
  rooms: RoomWithPeakRates[];
}

export const RoomsListSection: FC<RoomsListSectionProps> = (props) => {
  if (props.loading) return <div className="h-32 animate-pulse rounded-xl bg-gray-200 dark:bg-slate-700" />;
  if (props.rooms.length === 0) return <p className="text-sm text-gray-500">Belum ada kamar. Tambahkan kamar pertama.</p>;
  return (
    <div className="space-y-3">
      {props.rooms.map((room) => <RoomCard key={room.id} room={room} onDelete={props.onDelete} onEdit={props.handleEdit} onOpenAvail={props.handleOpenAvailModal} onOpenPeakRates={props.handleOpenPeakModal} />)}
    </div>
  );
};
