import type { FC } from 'react';
import { useEffect, useState, useRef } from 'react';
import { orderService } from '@/services/orderService';
import { reviewService } from '@/services/reviewService';
import type { Order } from '@/types';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { OrderCard } from '@/components/user/OrderCard';

const OrdersPage: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchOrders = () => {
    orderService.getUserOrders().then(setOrders).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUploadClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedOrderId) return;
    const order = orders.find(o => o.id === selectedOrderId);
    if (!order) return;
    if (order.status !== 'WAITING_PAYMENT') return toast.error('Bukti pembayaran hanya dapat diunggah untuk pesanan yang menunggu pembayaran.');

    setUploading(selectedOrderId);
    try {
      await orderService.uploadPaymentProof(selectedOrderId, file);
      toast.success('Bukti pembayaran berhasil diunggah! Menunggu konfirmasi.');
      fetchOrders();
    } catch { toast.error('Gagal mengunggah bukti pembayaran'); } 
    finally { setUploading(null); setSelectedOrderId(null); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewOrderId) return;
    const order = orders.find(o => o.id === reviewOrderId);
    if (!order) return;
    if (order.status !== 'PROCESSED' && order.status !== 'COMPLETED') return toast.error('Ulasan hanya dapat diberikan untuk pesanan yang sudah dikonfirmasi atau selesai.');
    if (order.review) return toast.error('Anda sudah memberikan ulasan untuk pesanan ini.');

    setSubmittingReview(true);
    try {
      await reviewService.createReview(reviewOrderId, rating, comment);
      toast.success('Review berhasil dikirim!');
      setReviewOrderId(null); setComment(''); setRating(5); fetchOrders();
    } catch (err: unknown) { const e = err as { response?: { data?: { message?: string } } }; toast.error(e.response?.data?.message || 'Gagal mengirim review'); } 
    finally { setSubmittingReview(false); }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const badges: Record<string, React.ReactNode> = {
      WAITING_PAYMENT: <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md text-xs font-medium"><Clock size={14}/> Menunggu Pembayaran</span>,
      WAITING_CONFIRMATION: <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-xs font-medium"><Clock size={14}/> Menunggu Konfirmasi</span>,
      PROCESSED: <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-medium"><CheckCircle2 size={14}/> Dikonfirmasi</span>,
      COMPLETED: <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs font-medium"><CheckCircle2 size={14}/> Selesai Menginap</span>,
      CANCELLED: <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-medium"><XCircle size={14}/> Dibatalkan</span>,
    };
    return badges[status] || null;
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Riwayat Pesanan Saya</h1>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700">
          <p className="text-gray-500">Belum ada riwayat pesanan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              uploading={uploading}
              handleUploadClick={handleUploadClick}
              reviewOrderId={reviewOrderId}
              setReviewOrderId={setReviewOrderId}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              handleReviewSubmit={handleReviewSubmit}
              submittingReview={submittingReview}
              StatusBadge={StatusBadge}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
