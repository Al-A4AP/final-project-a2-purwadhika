import type { FC } from "react";
import type { RoomWithPeakRates } from "@/types";
import { formatPrice } from "@/lib/formatters";

interface RoomInfoProps {
  isWholeUnit: boolean;
  room: RoomWithPeakRates;
}

const StockText: FC<RoomInfoProps> = ({ isWholeUnit, room }) => (
  <p className="mt-1 text-xs text-gray-500">{isWholeUnit ? "Disewakan sebagai satu unit penuh" : `Jumlah unit: ${room.quantity}`}</p>
);

export const RoomInfo: FC<RoomInfoProps> = ({ isWholeUnit, room }) => (
  <div className="min-w-0">
    <h3 className="font-semibold text-gray-900 dark:text-white">{room.room_type}</h3>
    <p className="text-sm text-gray-500">Kapasitas: {room.capacity} orang - {formatPrice(room.base_price)}/malam (Dewasa)</p>
    {room.child_price != null && <p className="text-xs text-blue-600 dark:text-blue-400">{formatPrice(room.child_price)}/malam (Anak) - Bayi: Gratis</p>}
    <StockText isWholeUnit={isWholeUnit} room={room} />
    {room.description && <p className="mt-1 text-xs text-gray-400">{room.description}</p>}
  </div>
);
