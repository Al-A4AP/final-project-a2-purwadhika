import type { FC } from "react";
import { ORDER_STATUS_FILTER_OPTIONS } from "@/lib/constants";
import type { DashboardRevenuePeriod, TenantProperty } from "@/types";
import { REPORT_REVENUE_PERIOD_OPTIONS, REPORT_SORT_OPTIONS } from "./reportOptions";
import type { ReportsFilterActions, ReportsFilters } from "./reportsTypes";
import { FilterDate, FilterSelect, TextFilter } from "./FilterControls";

interface ReportsFilterPanelProps {
  actions: ReportsFilterActions;
  filters: ReportsFilters;
  properties: TenantProperty[];
}

export const ReportsFilterPanel: FC<ReportsFilterPanelProps> = ({ actions, filters, properties }) => (
  <div className="grid grid-cols-1 gap-4 rounded-xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-2 xl:grid-cols-8">
    <FilterSelect label="Properti" value={filters.selectedPropertyId} onChange={actions.setSelectedPropertyId} options={getPropertyOptions(properties)} />
    <FilterSelect label="Periode Pendapatan" value={filters.revenuePeriod} onChange={(value) => setRevenuePeriod(value, actions)} options={REPORT_REVENUE_PERIOD_OPTIONS} />
    <FilterSelect label="Status Transaksi" value={filters.selectedStatus} onChange={actions.setSelectedStatus} options={ORDER_STATUS_FILTER_OPTIONS} />
    <TextFilter label="Nama Pemesan" value={filters.userName} onChange={actions.setUserName} placeholder="Cari nama..." />
    <FilterDate label="Mulai Tanggal" value={filters.startDate} onChange={actions.setStartDate} />
    <FilterDate label="Sampai Tanggal" value={filters.endDate} onChange={actions.setEndDate} />
    <FilterSelect label="Urutan Transaksi" value={`${filters.sortBy}-${filters.sortOrder}`} onChange={(value) => applySort(value, actions)} options={REPORT_SORT_OPTIONS} />
    <ResetButton onReset={actions.resetFilters} />
  </div>
);

const getPropertyOptions = (properties: TenantProperty[]) => [
  { value: "", label: "Semua Properti" },
  ...properties.map((property) => ({ value: property.id, label: property.name })),
];

const applySort = (value: string, actions: ReportsFilterActions) => {
  const [sortBy, sortOrder] = value.split("-");
  actions.setSortBy(sortBy);
  actions.setSortOrder(sortOrder as "asc" | "desc");
};

const setRevenuePeriod = (value: string, actions: ReportsFilterActions) =>
  actions.setRevenuePeriod(value as DashboardRevenuePeriod);

const ResetButton: FC<{ onReset: () => void }> = ({ onReset }) => (
  <button onClick={onReset} className="h-10 self-end rounded-lg border bg-white px-4 text-sm text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-700">Reset</button>
);
