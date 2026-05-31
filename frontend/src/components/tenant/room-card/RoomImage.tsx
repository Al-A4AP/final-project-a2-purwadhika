import type { FC } from "react";
import type { RoomWithPeakRates } from "@/types";

export const RoomImage: FC<{ room: RoomWithPeakRates }> = ({ room }) => (
  room.images?.[0] ? <img src={room.images[0].image_url} alt={room.room_type} className="h-20 w-20 rounded-lg border object-cover dark:border-slate-700" /> : null
);
