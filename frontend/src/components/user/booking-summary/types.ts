import type { PropertyDetail, Room } from "@/types";
import type { BookingGuestIdentity } from "@/hooks/user/booking/bookingTypes";

export interface BookingSummaryProps {
  guestIdentity: BookingGuestIdentity;
  guests: { adults: number; babies: number; children: number };
  nights: number;
  onCheckout: () => void;
  processing: boolean;
  property: PropertyDetail;
  room: Room;
  discountAmount?: number;
  totalPrice: number;
  totalRoomPrice: number;
}
