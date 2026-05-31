import type { FC } from "react";
import { Calendar as CalendarIcon, Pencil, Trash2, TrendingUp } from "lucide-react";
import type { RoomCardProps } from "./types";
import { RoomActionButton } from "./RoomActionButton";

export const RoomActions: FC<RoomCardProps> = (props) => (
  <div className="grid grid-cols-4 gap-2 sm:flex sm:shrink-0">
    <RoomActionButton icon={CalendarIcon} label="Atur Ketersediaan" roomType={props.room.room_type} onClick={() => props.onOpenAvail(props.room.id)} className="text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700" />
    <RoomActionButton icon={TrendingUp} label="Atur Peak Season" roomType={props.room.room_type} onClick={() => props.onOpenPeakRates(props.room.id)} className="text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20" />
    <RoomActionButton icon={Pencil} label="Edit Kamar" roomType={props.room.room_type} onClick={() => props.onEdit(props.room)} className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20" />
    <RoomActionButton icon={Trash2} label="Hapus Kamar" roomType={props.room.room_type} onClick={() => props.onDelete(props.room.id)} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" />
  </div>
);
