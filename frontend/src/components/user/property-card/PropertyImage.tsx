import type { FC } from "react";
import type { Property } from "@/types";
import { PropertyCategoryBadge } from "./PropertyCategoryBadge";
import { SavePropertyButton } from "./SavePropertyButton";

const fallbackImage = "https://via.placeholder.com/300x200?text=Property";

export const PropertyImage: FC<{ property: Property }> = ({ property }) => (
  <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-slate-700">
    <img src={property.featured_image_url || fallbackImage} alt={property.name} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" />
    <PropertyCategoryBadge category={property.category} />
    <SavePropertyButton property={property} className="absolute right-3 top-3 z-10" />
  </div>
);
