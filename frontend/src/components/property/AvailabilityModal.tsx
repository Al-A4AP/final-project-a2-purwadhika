import type { FC } from "react";
import { AvailabilityCalendar } from "./availability-modal/AvailabilityCalendar";
import { AvailabilityModalActions } from "./availability-modal/AvailabilityModalActions";
import { AvailabilityModalHeader } from "./availability-modal/AvailabilityModalHeader";
import type { AvailabilityModalProps } from "./availability-modal/availabilityModalTypes";

export const AvailabilityModal: FC<AvailabilityModalProps> = (props) => {
  if (!props.isOpen || !props.room) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl dark:bg-slate-800 md:p-6">
        <AvailabilityModalHeader room={props.room} onClose={props.onClose} />
        <AvailabilityCalendar room={props.room} checkIn={props.checkIn} checkOut={props.checkOut} dateError={props.dateError} onCheckInChange={props.onCheckInChange} onCheckOutChange={props.onCheckOutChange} />
        <AvailabilityModalActions room={props.room} checkIn={props.checkIn} checkOut={props.checkOut} bookingBlockedReason={props.bookingBlockedReason} onApply={props.onClose} onBook={props.onBook} />
      </div>
    </div>
  );
};
