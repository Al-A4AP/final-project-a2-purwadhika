import type { FC } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { orderService } from '@/services/orderService';
import { tenantService } from '@/services/tenantService';
import type { Order, TenantProperty, PaginationMeta } from '@/types';
import { formatPrice } from '@/lib/formatters';
import { Check, X, ExternalLink } from 'lucide-react';
import { Pagination } from '@/components/common/Pagination';

const TenantOrdersPage: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [properties, setProperties] = useState<TenantProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Filters State
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // Fetch properties once for filtering dropdown
  useEffect(() => {
    tenantService.getProperties({ limit: 100 })
      .then((data) => setProperties(data.properties))
      .catch(() => {});
  }, []);

  const fetchOrders = useCallback((pageNumber = 1) => {
    setLoading(true);
    orderService.getTenantOrders({
      propertyId: selectedPropertyId || undefined,
      status: selectedStatus || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy,
      sortOrder,
      page: pageNumber,
      limit: 10,
    })
      .then((data) => {
        setOrders(data.orders);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  }, [selectedPropertyId, selectedStatus, startDate, endDate, sortBy, sortOrder]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchOrders(1);
    });
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    let confirmMsg = `Ubah status pesanan menjadi ${status}?`;
    if (status === 'PROCESSED') {
      confirmMsg = 'Terima pembayaran dan proses pesanan ini?';
    } else if (status === 'CANCELLED') {
      confirmMsg = 'Tolak bukti pembayaran ini? Status pesanan akan dikembalikan ke Menunggu Pembayaran agar user dapat mengupload ulang.';
    }
    if (!confirm(confirmMsg)) return;
    setUpdating(orderId);
    try {
      await orderService.updateOrderStatus(orderId, status);
      fetchOrders(pagination.page);
    } catch {
      alert('Gagal memperbarui status');
    } finally {
      setUpdating(null);
    }
  };

  const totalPages = pagination.totalPages || pagination.pages || 1;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manajemen Pesanan</h1>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700 mb-6 flex flex-wrap gap-4 items-end shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Properti</label>
          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="w-full text-sm border dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-gray-900 dark:text-white"
          >
            <option value="">Semua Properti</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="w-[180px]">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full text-sm border dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-gray-900 dark:text-white"
          >
            <option value="">Semua Status</option>
            <option value="WAITING_PAYMENT">Menunggu Pembayaran</option>
            <option value="WAITING_CONFIRMATION">Menunggu Konfirmasi</option>
            <option value="PROCESSED">Dikonfirmasi</option>
            <option value="COMPLETED">Selesai Menginap</option>
            <option value="CANCELLED">Dibatalkan</option>
          </select>
        </div>

        <div className="w-[160px]">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Mulai Tanggal</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full text-sm border dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-gray-900 dark:text-white"
          />
        </div>

        <div className="w-[160px]">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Sampai Tanggal</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full text-sm border dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-gray-900 dark:text-white"
          />
        </div>

        <div className="w-[180px]">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Urutkan</label>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-');
              setSortBy(by);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="w-full text-sm border dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-gray-900 dark:text-white"
          >
            <option value="created_at-desc">Tanggal: Terbaru</option>
            <option value="created_at-asc">Tanggal: Terlama</option>
            <option value="total_price-desc">Total: Termahal</option>
            <option value="total_price-asc">Total: Termurah</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSelectedPropertyId('');
            setSelectedStatus('');
            setStartDate('');
            setEndDate('');
            setSortBy('created_at');
            setSortOrder('desc');
          }}
          className="px-4 py-2 border dark:border-slate-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <div className="p-10 text-center text-gray-500 dark:text-gray-400">Memuat data...</div>
      ) : (
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
                        ${order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : ''}
                        ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {order.status === 'PROCESSED' ? 'Dikonfirmasi' : 
                         order.status === 'COMPLETED' ? 'Selesai Menginap' : 
                         order.status === 'WAITING_PAYMENT' ? 'Menunggu Pembayaran' :
                         order.status === 'WAITING_CONFIRMATION' ? 'Menunggu Konfirmasi' :
                         order.status === 'CANCELLED' ? 'Dibatalkan' : order.status}
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

          <Pagination
            currentPage={pagination.page || 1}
            totalPages={totalPages}
            totalItems={pagination.total}
            onPageChange={fetchOrders}
          />
        </div>
      )}
    </div>
  );
};

export default TenantOrdersPage;
