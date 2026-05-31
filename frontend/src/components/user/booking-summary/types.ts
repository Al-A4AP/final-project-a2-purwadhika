import type { PropertyDetail, Room } from "@/types";

export interface BookingSummaryProps {
  guests: { adults: number; babies: number; children: number };
  nights: number;
  onCheckout: () => void;
  processing: boolean;
  property: PropertyDetail;
  room: Room;
  totalPrice: number;
  totalRoomPrice: number;
}
