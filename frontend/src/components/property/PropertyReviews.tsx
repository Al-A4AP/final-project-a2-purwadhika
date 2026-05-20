import type { FC } from 'react';
import type { Review } from '@/types';
import { Star, User } from 'lucide-react';

interface PropertyReviewsProps {
  reviews: Review[];
}

export const PropertyReviews: FC<PropertyReviewsProps> = ({ reviews }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ulasan Tamu</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500">Belum ada ulasan untuk properti ini.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border dark:border-slate-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                  {review.user?.avatar_url ? (
                    <img src={review.user.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{review.user?.name}</p>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    <Star size={14} fill="currentColor" /> {review.rating}/5
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{review.comment}</p>
              
              {/* Replies */}
              {review.replies && review.replies.map(reply => (
                <div key={reply.id} className="mt-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg ml-6">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Balasan dari Pemilik:</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{reply.reply_text}</p>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
