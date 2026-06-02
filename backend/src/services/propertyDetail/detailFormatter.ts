import type { PropertyRecord, RatingReview } from "./detailTypes";

const ratingAverage = (reviews?: RatingReview[]) => {
  const ratings = reviews?.map((review) => review.rating) || [];
  if (!ratings.length) return undefined;
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
};

const getMinPrice = (property: PropertyRecord) => {
  const prices = property.rooms?.map((room) => room.base_price) || [];
  return prices.length ? Math.min(...prices) : 0;
};

const roundRating = (rating?: number) =>
  rating ? Math.round(rating * 10) / 10 : undefined;

export const formatProperty = (property: PropertyRecord) => ({
  ...property,
  min_price: getMinPrice(property),
  rating: roundRating(ratingAverage(property.reviews)),
  review_count: property.reviews?.length || 0,
  order_count: property._count?.orders ?? 0,
  rooms: undefined,
  reviews: undefined,
  _count: undefined,
});
