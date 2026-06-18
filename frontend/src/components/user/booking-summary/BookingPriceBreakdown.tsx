import type { FC } from "react";
import type { BookingSummaryProps } from "./types";
import { GuestExtraRows } from "./GuestExtraRows";
import { RoomPriceRows } from "./RoomPriceRows";

export const BookingPriceBreakdown: FC<Pick<BookingSummaryProps, "guests" | "nights" | "room" | "totalRoomPrice">> = (props) => (
  <div className="mb-6 max-h-48 space-y-3 overflow-y-auto border-y py-4 text-xs dark:border-slate-700">
    <div className="font-semibold text-gray-700 dark:text-gray-300">Sewa Kamar ({props.nights} malam):</div>
    <RoomPriceRows nights={props.nights} room={props.room} totalRoomPrice={props.totalRoomPrice} />
    <GuestExtraRows adults={props.guests.adults} babies={props.guests.babies} children={props.guests.children} />
  </div>
);
