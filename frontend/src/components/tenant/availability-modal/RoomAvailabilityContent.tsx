import type { FC } from "react";
import { AvailabilityActionToggle } from "./AvailabilityActionToggle";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { AvailabilityFooter } from "./AvailabilityFooter";
import { AvailabilitySummary } from "./AvailabilitySummary";
import type { RoomAvailabilityModalProps } from "./availabilityTypes";

export const RoomAvailabilityContent: FC<RoomAvailabilityModalProps> = (props) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Atur Ketersediaan Tanggal</h2>
        <p className="mt-2 text-sm text-gray-500">Pilih rentang tanggal, pilih aksi, lalu konfirmasi. Tanggal tidak tersedia ditandai merah.</p>
      </div>
      <AvailabilityActionToggle isAvailable={props.isAvailable} onChange={props.onAvailableChange} />
      <AvailabilityCalendar blockedDays={props.blockedDays} range={props.range} onRangeChange={props.onRangeChange} />
      <AvailabilitySummary isAvailable={props.isAvailable} range={props.range} />
      <AvailabilityFooter isSaving={props.isSaving} range={props.range} onClose={props.onClose} onConfirm={props.onConfirm} />
    </div>
  </div>
);
