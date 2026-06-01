import type { FC } from "react";
import { RoomAvailabilityContent } from "./availability-modal/RoomAvailabilityContent";
import type { RoomAvailabilityModalProps } from "./availability-modal/availabilityTypes";

export const RoomAvailabilityModal: FC<RoomAvailabilityModalProps> = (props) =>
  props.isOpen ? <RoomAvailabilityContent {...props} /> : null;
