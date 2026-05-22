import type { FC } from 'react';
import { useEffect, useState, useRef } from 'react';
import { orderService } from '@/services/orderService';
import { reviewService } from '@/services/reviewService';
import type { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/formatters';
import { Clock, CheckCircle2, XCircle, CreditCard, UploadCloud, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

const OrdersPage: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // Review states
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchOrders = () => {
    orderService.getUserOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUploadClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedOrderId) return;

    const order = orders.find(o => o.id === selectedOrderId);
    if (!order) return;
    if (order.status !== 'WAITING_PAYMENT') {
      toast.error('Bukti pembayaran hanya dapat diunggah untuk pesanan yang menunggu pembayaran.');
      return;
    }

    setUploading(selectedOrderId);
    try {
      await orderService.uploadPaymentProof(selectedOrderId, file);
      toast.success('Bukti pembayaran berhasil diunggah! Menunggu konfirmasi.');
      fetchOrders();
    } catch {
      toast.error('Gagal mengunggah bukti pembayaran');
    } finally {
      setUploading(null);
      setSelectedOrderId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewOrderId) return;

    const order = orders.find(o => o.id === reviewOrderId);
    if (!order) return;
    if (order.status !== 'PROCESSED' && order.status !== 'COMPLETED') {
      toast.error('Ulasan hanya dapat diberikan untuk pesanan yang sudah dikonfirmasi atau selesai.');
      return;
    }
    if (order.review) {
      toast.error('Anda sudah memberikan ulasan untuk pesanan ini.');
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewService.createReview(reviewOrderId, rating, comment);
      toast.success('Review berhasil dikirim!');
      setReviewOrderId(null);
      setComment('');
      setRating(5);
      fetchOrders();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const errorMsg = e.response?.data?.message || 'Gagal mengirim review';
      toast.error(errorMsg);
    } finally {
      setSubmittingReview(false);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'WAITING_PAYMENT':
        return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md text-xs font-medium"><Clock size={14}/> Menunggu Pembayaran</span>;
      case 'WAITING_CONFIRMATION':
        return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-xs font-medium"><Clock size={14}/> Menunggu Konfirmasi</span>;
      case 'PROCESSED':
        return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-medium"><CheckCircle2 size={14}/> Dikonfirmasi</span>;
      case 'COMPLETED':
        return <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs font-medium"><CheckCircle2 size={14}/> Selesai Menginap</span>;
      case 'CANCELLED':
        return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-medium"><XCircle size={14}/> Dibatalkan</span>;
      default:
        return null;
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Riwayat Pesanan Saya</h1>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700">
          <p className="text-gray-500">Belum ada riwayat pesanan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6 shadow-sm">
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
                
                {/* Actions based on status */}
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

              {/* Review Form */}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
