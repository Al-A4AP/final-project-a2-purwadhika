import type { FC } from "react";
import { Star } from "lucide-react";

const RatingStar: FC<{ active: boolean; index: number }> = ({ active, index }) => (
  <Star key={index} size={16} className={active ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
);

export const PropertyRating: FC<{ rating?: number; reviewCount?: number }> = ({ rating, reviewCount }) => {
  if (rating === undefined) return null;
  return (
    <div className="mb-3 flex items-center text-sm">
      <div className="flex items-center">{[...Array(5)].map((_, i) => <RatingStar key={i} index={i} active={i < Math.floor(rating || 0)} />)}</div>
      <span className="ml-2 text-gray-600 dark:text-gray-400">({reviewCount || 0})</span>
    </div>
  );
};
