import type { FC } from "react";
import type { RoomWithPeakRates } from "@/types";
import { RoomImage } from "./RoomImage";
import { RoomInfo } from "./RoomInfo";

export const RoomSummary: FC<{ room: RoomWithPeakRates }> = ({ room }) => (
  <div className="flex min-w-0 gap-3">
    <RoomImage room={room} />
    <RoomInfo room={room} />
  </div>
);
