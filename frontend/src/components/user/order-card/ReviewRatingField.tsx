import type { FC } from "react";

import { Star } from "lucide-react";

export const ReviewRatingField: FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => (
  <div className="mb-3">
    <label className="mb-2 block text-sm text-gray-600 dark:text-gray-300">Rating</label>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
          <Star className={`h-6 w-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-gray-300 dark:text-gray-600"}`} />
        </button>
      ))}
    </div>
  </div>
);
