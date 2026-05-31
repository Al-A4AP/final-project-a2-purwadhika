import { useEffect, useState } from "react";
import { propertyService } from "@/services/propertyService";
import { reviewService } from "@/services/reviewService";
import type { PropertyDetail, Review } from "@/types";
import { hasValidDateRange } from "./propertyDetailDates";

const fetchPropertyDetail = (id: string, checkIn: string, checkOut: string) => {
  const hasDates = hasValidDateRange(checkIn, checkOut);
  return Promise.all([
    propertyService.getPropertyDetail(id, hasDates ? checkIn : undefined, hasDates ? checkOut : undefined),
    reviewService.getPropertyReviews(id),
  ]);
};

export const usePropertyDetailData = (id: string | undefined, checkIn: string, checkOut: string, onMissing: () => void) => {
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return onMissing();
    Promise.resolve().then(() => setLoading(true));
    fetchPropertyDetail(id, checkIn, checkOut)
      .then(([propertyData, reviewData]) => { setProperty(propertyData); setReviews(reviewData); })
      .catch(onMissing)
      .finally(() => setLoading(false));
  }, [checkIn, checkOut, id, onMissing]);

  return { loading, property, reviews };
};
