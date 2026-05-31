import type { FC } from "react";
import type { Room } from "@/types";
import { formatPrice } from "@/lib/formatters";
import { BookingBreakdownRow } from "./BookingBreakdownRow";
import { PeakRateTag } from "./PeakRateTag";

const priceText = (price: number) => price === 0 ? "Gratis" : formatPrice(price);

export const RoomPriceRows: FC<{ nights: number; room: Room; totalRoomPrice: number }> = ({ nights, room, totalRoomPrice }) => {
  if (!room.priceDetails) return <BookingBreakdownRow label={`${formatPrice(room.base_price)} x ${nights} malam`} value={formatPrice(totalRoomPrice)} />;
  return <>{room.priceDetails.breakdown.map((day, idx) => <BookingBreakdownRow key={idx} label={day.date} value={priceText(day.price)}>{day.isPeak && <PeakRateTag label={day.rateName} />}</BookingBreakdownRow>)}</>;
};
