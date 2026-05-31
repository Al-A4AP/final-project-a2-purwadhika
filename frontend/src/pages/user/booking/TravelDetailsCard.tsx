import type { FC } from "react";
import { TravelDateCard } from "./TravelDateCard";
import type { BookingTotals } from "./bookingTypes";

export const TravelDetailsCard: FC<{ totals: BookingTotals }> = ({ totals }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border dark:border-slate-700">
    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Detail Perjalanan</h2>
    <div className="grid grid-cols-2 gap-4">
      <TravelDateCard label="Check-in" date={totals.checkInDate} />
      <TravelDateCard label="Check-out" date={totals.checkOutDate} />
    </div>
  </div>
);
