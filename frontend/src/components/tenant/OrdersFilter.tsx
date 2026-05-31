import type { FC } from "react";
import type { TenantProperty } from "@/types";
import { ORDER_STATUS_FILTER_OPTIONS } from "@/lib/constants";

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
    <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-2 xl:grid-cols-6">
      <div className="min-w-0 sm:col-span-2 xl:col-span-1">
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

      <div className="min-w-0">
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
          Status
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full text-sm border dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-gray-900 dark:text-white"
        >
          {ORDER_STATUS_FILTER_OPTIONS.map((option) => (
            <option key={option.value || "all"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-0">
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

      <div className="min-w-0">
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

      <div className="min-w-0">
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
        className="h-10 rounded-lg border px-4 text-sm text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-700"
      >
        Reset
      </button>
    </div>
  );
};
