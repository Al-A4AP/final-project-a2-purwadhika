import type { FC } from "react";
import type { Property } from "@/types";
import { PropertyLocation } from "./PropertyLocation";
import { PropertyPrice } from "./PropertyPrice";
import { PropertyRating } from "./PropertyRating";

export const PropertyCardBody: FC<{ property: Property }> = ({ property }) => (
  <div className="p-4">
    <h3 className="mb-1 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">{property.name}</h3>
    <PropertyLocation city={property.city} />
    <PropertyRating rating={property.rating} reviewCount={property.review_count} />
    <PropertyPrice minPrice={property.min_price} />
  </div>
);
