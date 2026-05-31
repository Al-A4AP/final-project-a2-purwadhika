import type { FC } from "react";

export const ReviewRatingField: FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => (
  <div className="mb-3">
    <label className="text-sm text-gray-600 dark:text-gray-300">Rating (1-5)</label>
    <input type="number" min="1" max="5" value={rating} onChange={(event) => setRating(Number(event.target.value))} className="mt-1 w-full rounded-md border p-2 dark:border-slate-600 dark:bg-slate-800" required />
  </div>
);
