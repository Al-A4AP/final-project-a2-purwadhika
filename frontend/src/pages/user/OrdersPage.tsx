import type { FC } from 'react';
import { useEffect, useState, useRef } from 'react';
import { orderService } from '@/services/orderService';
import type { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/formatters';
import { Clock, CheckCircle2, XCircle, CreditCard, UploadCloud } from 'lucide-react';

const OrdersPage: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

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

    setUploading(selectedOrderId);
    try {
      await orderService.uploadPaymentProof(selectedOrderId, file);
      alert('Bukti pembayaran berhasil diunggah! Menunggu konfirmasi.');
      fetchOrders();
    } catch {
      alert('Gagal mengunggah bukti pembayaran');
    } finally {
      setUploading(null);
      setSelectedOrderId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'WAITING_PAYMENT':
        return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md text-xs font-medium"><Clock size={14}/> Menunggu Pembayaran</span>;
      case 'WAITING_CONFIRMATION':
        return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-xs font-medium"><Clock size={14}/> Menunggu Konfirmasi</span>;
      case 'PROCESSED':
        return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-medium"><CheckCircle2 size={14}/> Selesai</span>;
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
