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
    loadPropertyDetail({ checkIn, checkOut, id, onMissing, setLoading, setProperty, setReviews });
  }, [checkIn, checkOut, id, onMissing]);

  return { loading, property, reviews };
};

const loadPropertyDetail = (options: LoadPropertyDetailOptions) => {
  if (!options.id) return options.onMissing();
  Promise.resolve().then(() => options.setLoading(true));
  fetchPropertyDetail(options.id, options.checkIn, options.checkOut)
    .then((data) => applyPropertyDetail(data, options))
    .catch(options.onMissing)
    .finally(() => options.setLoading(false));
};

const applyPropertyDetail = ([property, reviews]: PropertyDetailResult, options: LoadPropertyDetailOptions) => {
  options.setProperty(property);
  options.setReviews(reviews);
};

type PropertyDetailResult = [PropertyDetail, Review[]];

interface LoadPropertyDetailOptions {
  checkIn: string;
  checkOut: string;
  id?: string;
  onMissing: () => void;
  setLoading: (value: boolean) => void;
  setProperty: (property: PropertyDetail) => void;
  setReviews: (reviews: Review[]) => void;
}
