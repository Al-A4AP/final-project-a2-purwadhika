import type { FC } from "react";
import type { TenantProperty } from "@/types";
import { REPORT_SORT_OPTIONS, REPORT_STATUS_OPTIONS } from "./reportOptions";
import type { ReportsFilterActions, ReportsFilters } from "./reportsTypes";
import { FilterDate, FilterSelect, TextFilter } from "./FilterControls";

interface ReportsFilterPanelProps {
  actions: ReportsFilterActions;
  filters: ReportsFilters;
  properties: TenantProperty[];
}

export const ReportsFilterPanel: FC<ReportsFilterPanelProps> = ({ actions, filters, properties }) => (
  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700 flex flex-wrap gap-4 items-end shadow-sm"><FilterSelect label="Properti" value={filters.selectedPropertyId} onChange={actions.setSelectedPropertyId} options={getPropertyOptions(properties)} /><FilterSelect label="Status Transaksi" value={filters.selectedStatus} onChange={actions.setSelectedStatus} options={REPORT_STATUS_OPTIONS} /><TextFilter label="Nama Pemesan" value={filters.userName} onChange={actions.setUserName} placeholder="Cari nama..." /><FilterDate label="Mulai Tanggal" value={filters.startDate} onChange={actions.setStartDate} /><FilterDate label="Sampai Tanggal" value={filters.endDate} onChange={actions.setEndDate} /><FilterSelect label="Urutan Transaksi" value={`${filters.sortBy}-${filters.sortOrder}`} onChange={(value) => applySort(value, actions)} options={REPORT_SORT_OPTIONS} /><button onClick={actions.resetFilters} className="px-4 py-2 border dark:border-slate-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 bg-white dark:bg-slate-900">Reset</button></div>
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
