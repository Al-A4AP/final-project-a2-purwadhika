import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { tenantService } from '@/services/tenantService';
import { Pagination } from '@/components/common/Pagination';
import { toast } from 'react-hot-toast';
import { Star, MessageSquare, Send, User } from 'lucide-react';
import type { Review, PaginationMeta } from '@/types';

const ReviewsPage: FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({});

  const fetchReviews = (page = 1) => {
    return tenantService.getReviews({ page, limit: 10 })
      .then((data: { reviews: Review[]; pagination: PaginationMeta }) => {
        setReviews(data.reviews);
        setPagination(data.pagination);
      })
      .catch(() => toast.error('Gagal memuat ulasan'));
  };

  useEffect(() => {
    fetchReviews(1).finally(() => setLoading(false));
  }, []);

  const handlePageChange = (page: number) => {
    setLoading(true);
    fetchReviews(page).finally(() => setLoading(false));
  };

  const handleReplyChange = (reviewId: string, text: string) => {
    setReplyText(prev => ({ ...prev, [reviewId]: text }));
  };

  const handleReplySubmit = async (reviewId: string) => {
    const text = replyText[reviewId]?.trim();
    if (!text) {
      toast.error('Balasan tidak boleh kosong');
      return;
    }

    setSubmitting(prev => ({ ...prev, [reviewId]: true }));
    try {
      const reply = await tenantService.replyToReview(reviewId, text);
      toast.success('Balasan berhasil dikirim');
      setReviews(prev => prev.map(r => {
        if (r.id === reviewId) {
          return { ...r, replies: [...(r.replies || []), reply] };
        }
        return r;
      }));
      setReplyText(prev => ({ ...prev, [reviewId]: '' }));
    } catch {
      toast.error('Gagal mengirim balasan');
    } finally {
      setSubmitting(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  if (loading && reviews.length === 0) return (
    <div className="p-8 space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="h-40 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />)}
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <MessageSquare className="text-red-600" size={28} />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ulasan Tamu</h1>
      </div>

      <p className="text-sm text-gray-500">Lihat ulasan dari tamu dan berikan balasan yang profesional untuk membangun reputasi properti Anda.</p>

      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700">
          <MessageSquare size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
          <p className="text-gray-500 font-medium">Belum ada ulasan yang masuk</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => {
            const hasReply = review.replies && review.replies.length > 0;
            return (
              <div key={review.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border dark:border-slate-700">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                      {review.user?.avatar_url ? (
                        <img src={review.user.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{review.user?.name}</p>
                      <div className="flex items-center gap-1 text-yellow-500 text-sm mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-slate-600'} />
                        ))}
                        <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({review.rating}/5)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-700/50 px-3 py-1 rounded-lg inline-block">
                      {review.property?.name || 'Properti Dihapus'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm italic mb-6">"{review.comment}"</p>

                {hasReply ? (
                  <div className="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-5 ml-4 sm:ml-8 border dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={16} className="text-emerald-600 dark:text-emerald-500" />
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">Balasan Anda</p>
                    </div>
                    {review.replies?.map(reply => (
                      <p key={reply.id} className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{reply.reply_text}</p>
                    ))}
                  </div>
                ) : (
                  <div className="ml-4 sm:ml-8 mt-2 relative">
                    <textarea
                      placeholder="Tulis balasan Anda untuk tamu ini..."
                      value={replyText[review.id] || ''}
                      onChange={(e) => handleReplyChange(review.id, e.target.value)}
                      disabled={submitting[review.id]}
                      className="w-full text-sm border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl p-3 pr-24 focus:ring-2 focus:ring-red-500 outline-none resize-y min-h-20"
                    ></textarea>
                    <button
                      onClick={() => handleReplySubmit(review.id)}
                      disabled={submitting[review.id] || !replyText[review.id]?.trim()}
                      className="absolute right-2 bottom-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      {submitting[review.id] ? 'Mengirim...' : <><Send size={14} /> Balas</>}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Pagination
        currentPage={pagination.page || 1}
        totalPages={pagination.totalPages || 1}
        totalItems={pagination.total || 0}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ReviewsPage;
