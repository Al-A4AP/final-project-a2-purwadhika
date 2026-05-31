import type { FC } from "react";
import { MapPin } from "lucide-react";

export const PropertyLocation: FC<{ city: string }> = ({ city }) => (
  <div className="mb-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
    <MapPin size={16} className="mr-1" />
    {city}
  </div>
);
