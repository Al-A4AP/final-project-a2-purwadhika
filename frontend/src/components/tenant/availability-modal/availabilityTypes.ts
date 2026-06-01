import type { DateRange } from "react-day-picker";

export interface RoomAvailabilityModalProps {
  blockedDays: Date[];
  isAvailable: boolean;
  isOpen: boolean;
  isSaving: boolean;
  range?: DateRange;
  onAvailableChange: (value: boolean) => void;
  onClose: () => void;
  onConfirm: () => void;
  onRangeChange: (range?: DateRange) => void;
}
