import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { orderService } from '@/services/orderService';
import type { Order } from '@/types';
import { formatPrice } from '@/lib/formatters';
import { Check, X, ExternalLink } from 'lucide-react';

const TenantOrdersPage: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = () => {
    orderService.getTenantOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    if (!confirm(`Ubah status pesanan menjadi ${status}?`)) return;
    setUpdating(orderId);
    try {
      await orderService.updateOrderStatus(orderId, status);
      fetchOrders();
    } catch {
      alert('Gagal memperbarui status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manajemen Pesanan</h1>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Order ID & Tamu</th>
                <th className="px-6 py-4">Properti & Kamar</th>
                <th className="px-6 py-4">Check In/Out</th>
                <th className="px-6 py-4">Total & Metode</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center">Belum ada pesanan masuk.</td></tr>
              ) : orders.map(order => (
                <tr key={order.id} className="border-b dark:border-slate-700 bg-white dark:bg-slate-800">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{order.order_number}</p>
                    <p className="text-xs">{order.user?.name}</p>
                    <p className="text-xs">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{order.property?.name}</p>
                    <p className="text-xs">{order.room?.room_type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p>{new Date(order.check_in_date).toLocaleDateString('id-ID')}</p>
                    <p>{new Date(order.check_out_date).toLocaleDateString('id-ID')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{formatPrice(order.total_price)}</p>
                    <p className="text-xs">{order.payment_method}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium
                      ${order.status === 'WAITING_PAYMENT' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${order.status === 'WAITING_CONFIRMATION' ? 'bg-blue-100 text-blue-800' : ''}
                      ${order.status === 'PROCESSED' ? 'bg-green-100 text-green-800' : ''}
                      ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {order.status}
                    </span>
                    {order.payment_proof_url && (
                      <a href={order.payment_proof_url} target="_blank" rel="noreferrer" className="block mt-2 text-xs text-blue-600 hover:underline items-center gap-1">
                        Lihat Bukti <ExternalLink size={12}/>
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {order.status === 'WAITING_CONFIRMATION' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUpdateStatus(order.id, 'PROCESSED')}
                          disabled={updating === order.id}
                          className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100" title="Terima"
                        >
                          <Check size={16}/>
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                          disabled={updating === order.id}
                          className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Tolak"
                        >
                          <X size={16}/>
                        </button>
                      </div>
                    )}
                    {order.status === 'WAITING_PAYMENT' && order.payment_method === 'MANUAL' && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                        disabled={updating === order.id}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Batalkan Pesanan
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TenantOrdersPage;
