import type { FC } from "react";
import type { RoomWithPeakRates } from "@/types";
import { RoomImage } from "./RoomImage";
import { RoomInfo } from "./RoomInfo";

interface RoomSummaryProps {
  isWholeUnit: boolean;
  room: RoomWithPeakRates;
}

export const RoomSummary: FC<RoomSummaryProps> = ({ isWholeUnit, room }) => (
  <div className="flex min-w-0 gap-3">
    <RoomImage room={room} />
    <RoomInfo isWholeUnit={isWholeUnit} room={room} />
  </div>
);
