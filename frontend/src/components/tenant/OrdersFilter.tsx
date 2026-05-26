import type { FC } from "react";
import type { TenantProperty } from "@/types";

interface OrdersFilterProps {
  properties: TenantProperty[];
  selectedPropertyId: string;
  setSelectedPropertyId: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (val: "asc" | "desc") => void;
  resetFilters: () => void;
}

export const OrdersFilter: FC<OrdersFilterProps> = ({
  properties,
  selectedPropertyId,
  setSelectedPropertyId,
  selectedStatus,
  setSelectedStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  resetFilters,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700 mb-6 flex flex-wrap gap-4 items-end shadow-sm">
      <div className="flex-1 min-w-50">
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
          Properti
        </label>
        <select
          value={selectedPropertyId}
          onChange={(e) => setSelectedPropertyId(e.target.value)}
          className="w-full text-sm border dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-gray-900 dark:text-white"
        >
          <option value="">Semua Properti</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-45">
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
          Status
        </label>
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

      <div className="w-40">
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
          Mulai Tanggal
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full text-sm border dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-gray-900 dark:text-white"
        />
      </div>

      <div className="w-40">
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
          Sampai Tanggal
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full text-sm border dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-gray-900 dark:text-white"
        />
      </div>

      <div className="w-45">
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
          Urutkan
        </label>
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [by, order] = e.target.value.split("-");
            setSortBy(by);
            setSortOrder(order as "asc" | "desc");
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
        onClick={resetFilters}
        className="px-4 py-2 border dark:border-slate-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
      >
        Reset
      </button>
    </div>
  );
};
