import type { DateRange } from "react-day-picker";

export interface RoomAvailabilityModalProps {
  customerBookedDays: Date[];
  isAvailable: boolean;
  isOpen: boolean;
  isSaving: boolean;
  range?: DateRange;
  tenantBlockedDays: Date[];
  onAvailableChange: (value: boolean) => void;
  onClose: () => void;
  onConfirm: () => void;
  onRangeChange: (range?: DateRange) => void;
}
