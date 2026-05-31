import type { FC } from "react";
import { Star } from "lucide-react";

export const RatingStars: FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-1 text-yellow-500 text-sm mt-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < rating ? "currentColor" : "none"} className={i < rating ? "text-yellow-500" : "text-gray-300 dark:text-slate-600"} />)}<span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({rating}/5)</span></div>
);
