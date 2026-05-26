import type { FC } from "react";
import { useEffect, useState, useCallback } from "react";
import { orderService } from "@/services/orderService";
import { tenantService } from "@/services/tenantService";
import type { Order, TenantProperty, PaginationMeta } from "@/types";
import { Pagination } from "@/components/common/Pagination";
import { toast } from "react-hot-toast";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { OrdersFilter } from "@/components/tenant/OrdersFilter";
import { OrdersTable } from "@/components/tenant/OrdersTable";

const TenantOrdersPage: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [properties, setProperties] = useState<TenantProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1, limit: 10, total: 0, totalPages: 1,
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, title: "", message: "", onConfirm: () => {},
  });

  useEffect(() => {
    tenantService.getProperties({ limit: 100 })
      .then((data) => setProperties(data.properties)).catch(() => {});
  }, []);

  const fetchOrders = useCallback((pageNumber = 1) => {
    setLoading(true);
    orderService.getTenantOrders({
      propertyId: selectedPropertyId || undefined,
      status: selectedStatus || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy, sortOrder, page: pageNumber, limit: 10,
    }).then((data) => {
      setOrders(data.orders);
      setPagination(data.pagination);
    }).finally(() => setLoading(false));
  }, [selectedPropertyId, selectedStatus, startDate, endDate, sortBy, sortOrder]);

  useEffect(() => { Promise.resolve().then(() => fetchOrders(1)); }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const allowedTransitions: Record<string, string[]> = {
      WAITING_CONFIRMATION: ["PROCESSED", "CANCELLED"],
      WAITING_PAYMENT: ["CANCELLED"],
    };

    const allowed = allowedTransitions[order.status];
    if (!allowed || !allowed.includes(status)) {
      toast.error(`Gagal: Transisi status dari ${order.status} ke ${status} tidak diperbolehkan.`);
      return;
    }

    let confirmMsg = `Ubah status pesanan menjadi ${status}?`;
    if (status === "PROCESSED") confirmMsg = "Terima pembayaran dan proses pesanan ini?";
    else if (status === "CANCELLED") confirmMsg = "Batalkan pesanan ini?";
    
    setConfirmModal({
      isOpen: true, title: "Konfirmasi Aksi", message: confirmMsg,
      onConfirm: async () => {
        setUpdating(orderId);
        try {
          await orderService.updateOrderStatus(orderId, status);
          toast.success("Status pesanan berhasil diperbarui!");
          fetchOrders(pagination.page);
        } catch { toast.error("Gagal memperbarui status"); } 
        finally { setUpdating(null); }
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const totalPages = pagination.totalPages || pagination.pages || 1;
  const resetFilters = () => {
    setSelectedPropertyId(""); setSelectedStatus(""); setStartDate("");
    setEndDate(""); setSortBy("created_at"); setSortOrder("desc");
  };

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manajemen Pesanan</h1>
      <OrdersFilter
        properties={properties}
        selectedPropertyId={selectedPropertyId} setSelectedPropertyId={setSelectedPropertyId}
        selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
        startDate={startDate} setStartDate={setStartDate}
        endDate={endDate} setEndDate={setEndDate}
        sortBy={sortBy} setSortBy={setSortBy}
        sortOrder={sortOrder} setSortOrder={setSortOrder}
        resetFilters={resetFilters}
      />

      {loading ? (
        <div className="p-10 text-center text-gray-500 dark:text-gray-400">Memuat data...</div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden">
          <OrdersTable orders={orders} updating={updating} handleUpdateStatus={handleUpdateStatus} />
          <Pagination
            currentPage={pagination.page || 1}
            totalPages={totalPages}
            totalItems={pagination.total}
            onPageChange={fetchOrders}
          />
        </div>
      )}
      <ConfirmModal
        isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default TenantOrdersPage;
