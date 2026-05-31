import type { FC } from "react";
import type { PropertyDetail, Room } from "@/types";

export const BookingPropertyPreview: FC<{ property: PropertyDetail; room: Room }> = ({ property, room }) => (
  <div className="mb-6 flex gap-4">
    <img src={property.featured_image_url || ""} alt="Property" className="h-20 w-20 rounded-lg object-cover" />
    <div>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">{property.name}</p>
      <p className="text-xs text-gray-500">{room.room_type}</p>
    </div>
  </div>
);
