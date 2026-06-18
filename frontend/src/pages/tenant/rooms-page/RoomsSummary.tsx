import type { FC } from "react";
import type { RoomWithPeakRates } from "@/types";
import { RoomsSummaryCards } from "./RoomsSummaryParts";

interface RoomsSummaryProps {
  rooms: RoomWithPeakRates[];
}

export const RoomsSummary: FC<RoomsSummaryProps> = ({ rooms }) => {
  const totalRooms = rooms.length;
  return <RoomsSummaryCards averagePrice={averageRoomPrice(rooms)} maxCapacity={maximumCapacity(rooms)} totalRooms={totalRooms} />;
};

const averageRoomPrice = (rooms: RoomWithPeakRates[]) =>
  rooms.length ? rooms.reduce((total, room) => total + room.base_price, 0) / rooms.length : 0;

const maximumCapacity = (rooms: RoomWithPeakRates[]) =>
  rooms.length ? Math.max(...rooms.map((room) => room.capacity)) : 0;
