import type { FC } from 'react';
import { CreditCard, UploadCloud, Check } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/formatters';
import type { Order } from '@/types';

interface OrderCardProps {
  order: Order;
  uploading: string | null;
  handleUploadClick: (id: string) => void;
  reviewOrderId: string | null;
  setReviewOrderId: (id: string | null) => void;
  rating: number;
  setRating: (r: number) => void;
  comment: string;
  setComment: (c: string) => void;
  handleReviewSubmit: (e: React.FormEvent) => void;
  submittingReview: boolean;
  StatusBadge: FC<{ status: string }>;
}

export const OrderCard: FC<OrderCardProps> = ({
  order, uploading, handleUploadClick, reviewOrderId, setReviewOrderId,
  rating, setRating, comment, setComment, handleReviewSubmit, submittingReview, StatusBadge
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 pb-4 border-b dark:border-slate-700">
        <div>
          <p className="text-sm text-gray-500 mb-1">Order ID: {order.order_number}</p>
          <p className="font-semibold text-gray-900 dark:text-white text-lg">{order.property?.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{order.room?.room_type}</p>
        </div>
        <div className="text-left md:text-right">
          <StatusBadge status={order.status} />
          <p className="font-bold text-red-600 mt-2">{formatPrice(order.total_price)}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 text-sm">
        <div>
          <p className="text-gray-500 mb-1">Jadwal Menginap</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {formatDate(order.check_in_date)} - {formatDate(order.check_out_date)}
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Metode Pembayaran</p>
          <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard size={16}/> {order.payment_method === 'MIDTRANS' ? 'Otomatis (Midtrans)' : 'Manual Transfer'}
          </p>
        </div>
        
        <div>
          {order.status === 'WAITING_PAYMENT' && order.payment_method === 'MANUAL' && (
            <button 
              onClick={() => handleUploadClick(order.id)}
              disabled={uploading === order.id}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              {uploading === order.id ? 'Mengunggah...' : <><UploadCloud size={16}/> Unggah Bukti Bayar</>}
            </button>
          )}
          {order.status === 'WAITING_PAYMENT' && order.payment_method === 'MIDTRANS' && !order.midtrans_transaction_id && (
            <p className="text-yellow-600 text-xs mt-2 italic">Menunggu pembayaran Midtrans diselesaikan.</p>
          )}
          {order.status === 'PROCESSED' && !order.review && (
            <button 
              onClick={() => setReviewOrderId(reviewOrderId === order.id ? null : order.id)}
              className="text-sm text-blue-600 hover:underline mt-2"
            >
              Beri Ulasan
            </button>
          )}
          {order.review && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <Check size={12} /> Sudah diulas
            </p>
          )}
        </div>
      </div>

      {reviewOrderId === order.id && (
        <form onSubmit={handleReviewSubmit} className="mt-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border dark:border-slate-600">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Berikan Ulasan Anda</h4>
          <div className="mb-3">
            <label className="text-sm text-gray-600 dark:text-gray-300">Rating (1-5)</label>
            <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-md dark:bg-slate-800 dark:border-slate-600" required />
          </div>
          <div className="mb-3">
            <label className="text-sm text-gray-600 dark:text-gray-300">Komentar</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full mt-1 p-2 border rounded-md dark:bg-slate-800 dark:border-slate-600" required rows={3}></textarea>
          </div>
          <button type="submit" disabled={submittingReview} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition disabled:opacity-70">
            {submittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
          </button>
        </form>
      )}
    </div>
  );
};
