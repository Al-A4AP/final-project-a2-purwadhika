import type { FC } from "react";
import type { Room } from "@/types";

interface AvailabilityModalActionsProps {
  bookingBlockedReason?: string;
  checkIn: string;
  checkOut: string;
  room: Room;
  onApply: () => void;
  onBook: (room: Room, checkIn: string, checkOut: string) => void;
}

export const AvailabilityModalActions: FC<AvailabilityModalActionsProps> = (props) => (
  <div className="mt-6 flex flex-col gap-3 border-t pt-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
    <BookingHint message={props.bookingBlockedReason} />
    <PrimaryButton {...props} />
  </div>
);

const PrimaryButton: FC<AvailabilityModalActionsProps> = (props) => (
  <button onClick={() => handlePrimaryClick(props)} disabled={isPrimaryDisabled(props)}
    className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-100"
  >
    {primaryLabel(props)}
  </button>
);

const BookingHint: FC<{ message?: string }> = ({ message }) => (
  message ? <p className="text-sm text-amber-600 dark:text-amber-400">{message}</p> : <p className="text-sm text-gray-500 dark:text-gray-400">Pilih tanggal tersedia, lalu lanjutkan pemesanan.</p>
);

const canBook = (props: AvailabilityModalActionsProps) =>
  Boolean(props.checkIn && props.checkOut && !props.bookingBlockedReason);

const handlePrimaryClick = (props: AvailabilityModalActionsProps) =>
  canBook(props) ? props.onBook(props.room, props.checkIn, props.checkOut) : props.onApply();

const isPrimaryDisabled = (props: AvailabilityModalActionsProps) =>
  !props.checkIn || !props.checkOut;

const primaryLabel = (props: AvailabilityModalActionsProps) =>
  canBook(props) ? "Pesan" : "Gunakan Tanggal Ini";
