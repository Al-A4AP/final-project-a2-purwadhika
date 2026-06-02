import type { Room } from "@/types";

export interface AvailabilityModalProps {
  bookingBlockedReason?: string;
  checkIn: string;
  checkOut: string;
  dateError: string;
  isOpen: boolean;
  room: Room | null;
  onBook: (room: Room, checkIn: string, checkOut: string) => void;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  onClose: () => void;
}
