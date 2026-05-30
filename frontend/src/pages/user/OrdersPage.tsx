import type { FC } from 'react';
import { useCallback, useEffect, useState, useRef } from 'react';
import { orderService } from '@/services/orderService';
import { reviewService } from '@/services/reviewService';
import type { Order } from '@/types';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { OrderCard } from '@/components/user/OrderCard';
import { canReviewOrder } from '@/lib/orderStatus';
import { Pagination } from '@/components/common/Pagination';
import type { PaginationMeta } from '@/types';

const OrdersPage: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1, limit: 10, total: 0, totalPages: 1,
  });
  
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchOrders = useCallback((page = 1) => {
    setLoading(true);
    orderService.getUserOrders({
      orderNumber, status, startDate, endDate, page, limit: 10,
    }).then((data) => {
      setOrders(data.orders);
      setPagination(data.pagination);
    }).finally(() => setLoading(false));
  }, [endDate, orderNumber, startDate, status]);

  useEffect(() => { Promise.resolve().then(() => fetchOrders()); }, [fetchOrders]);

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
    if (!canReviewOrder(order)) return toast.error('Ulasan hanya dapat diberikan setelah checkout selesai.');
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
  const totalPages = pagination.totalPages || pagination.pages || 1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Riwayat Pesanan Saya</h1>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <div className="grid md:grid-cols-5 gap-3 mb-6 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-4">
        <input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="Nomor order" className="px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm">
          <option value="">Semua Status</option>
          <option value="WAITING_PAYMENT">Menunggu Pembayaran</option>
          <option value="WAITING_CONFIRMATION">Menunggu Konfirmasi</option>
          <option value="PROCESSED">Dikonfirmasi</option>
          <option value="COMPLETED">Selesai</option>
          <option value="CANCELLED">Dibatalkan</option>
        </select>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm" />
        <button onClick={() => fetchOrders(1)} className="bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">Cari</button>
      </div>

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
          <Pagination currentPage={pagination.page || 1} totalPages={totalPages} totalItems={pagination.total} onPageChange={fetchOrders} />
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
