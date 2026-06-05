import type { FC } from "react";
import { Star } from "lucide-react";

export const RatingStars: FC<{ rating: number }> = ({ rating }) => (
  <div className="mt-1 flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < rating ? "currentColor" : "none"}
        className={i < rating ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}
      />
    ))}
    <span className="ml-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">{rating}/5</span>
  </div>
);
