import { parseDateFilters } from "./propertyDetail/detailDates";
import { formatProperty } from "./propertyDetail/detailFormatter";
import { findProperty } from "./propertyDetail/detailQueries";
import type { PropertyDetailFilters } from "./propertyDetail/detailTypes";
import { fetchDetailedRoomsStatus } from "./propertyDetail/roomStatus";

const buildPropertyDetailResponse = async (
  id: string,
  filters?: PropertyDetailFilters,
) => {
  const property = await findProperty(id);
  const { checkIn, checkOut } = parseDateFilters(filters);
  const rooms = await fetchDetailedRoomsStatus(property as any, checkIn, checkOut);
  return { property, rooms };
};

export const getPropertyDetail = async (
  id: string,
  filters?: PropertyDetailFilters,
) => {
  const { property, rooms } = await buildPropertyDetailResponse(id, filters);
  return {
    ...formatProperty(property),
    images: property.images,
    rooms,
    reviews: property.reviews,
  };
};
