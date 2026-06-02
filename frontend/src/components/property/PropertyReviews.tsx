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
      <ReviewsGrid reviews={reviews} />
    </div>
  );
};

const ReviewsGrid: FC<PropertyReviewsProps> = ({ reviews }) => (
  <div className="grid md:grid-cols-2 gap-6">
    {reviews.length === 0 ? <EmptyReviews /> : reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
  </div>
);

const EmptyReviews = () => (
  <p className="text-gray-500">Belum ada ulasan untuk properti ini.</p>
);

const ReviewCard: FC<{ review: Review }> = ({ review }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border dark:border-slate-700">
    <ReviewAuthor review={review} />
    <p className="text-gray-600 dark:text-gray-300 text-sm">{review.comment}</p>
    <ReviewReplies replies={review.replies} />
  </div>
);

const ReviewAuthor: FC<{ review: Review }> = ({ review }) => (
  <div className="flex items-center gap-4 mb-4">
    <ReviewAvatar avatarUrl={review.user?.avatar_url} />
    <div>
      <p className="font-semibold text-gray-900 dark:text-white">{review.user?.name}</p>
      <RatingLine rating={review.rating} />
    </div>
  </div>
);

const ReviewAvatar: FC<{ avatarUrl?: string | null }> = ({ avatarUrl }) => (
  <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
    {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : <User size={20} className="text-gray-500" />}
  </div>
);

const RatingLine: FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-1 text-yellow-500 text-sm">
    <Star size={14} fill="currentColor" /> {rating}/5
  </div>
);

const ReviewReplies: FC<{ replies?: Review['replies'] }> = ({ replies }) => (
  <>
    {replies?.map((reply) => (
      <ReplyCard key={reply.id} replyText={reply.reply_text} />
    ))}
  </>
);

const ReplyCard: FC<{ replyText: string }> = ({ replyText }) => (
  <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg ml-6">
    <p className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Balasan dari Pemilik:</p>
    <p className="text-gray-600 dark:text-gray-300 text-sm">{replyText}</p>
  </div>
);
