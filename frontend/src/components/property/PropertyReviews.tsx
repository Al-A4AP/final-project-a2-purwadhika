import type { FC } from 'react';
import type { Review } from '@/types';
import { Star, User } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

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
  <div className="col-span-1 md:col-span-2">
    <EmptyState 
      title="Belum Ada Ulasan" 
      description="Properti ini belum memiliki ulasan dari tamu. Jadilah yang pertama memberikan ulasan setelah Anda menginap!" 
    />
  </div>
);

const ReviewCard: FC<{ review: Review }> = ({ review }) => (
  <div className="bg-white/60 backdrop-blur-sm dark:bg-slate-900/60 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
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
  <div className="flex items-center gap-1 text-rose-500 text-sm font-medium">
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
