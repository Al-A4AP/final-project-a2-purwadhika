import type { FC, ReactNode } from "react";
import { Filter } from "lucide-react";
import { ORDER_STATUS_FILTER_OPTIONS } from "@/lib/constants";
import type { DashboardRevenuePeriod, TenantProperty } from "@/types";
import {
  REPORT_REVENUE_PERIOD_OPTIONS,
  REPORT_SORT_OPTIONS,
} from "@/hooks/tenant/reports/reportOptions";
import type { ReportsFilterActions, ReportsFilters } from "@/hooks/tenant/reports/reportsTypes";
import {
  FilterDate,
  FilterLabel,
  FilterSelect,
  TextFilter,
} from "./FilterControls";

interface ReportsFilterPanelProps {
  actions: ReportsFilterActions;
  filters: ReportsFilters;
  properties: TenantProperty[];
}

export const ReportsFilterPanel: FC<ReportsFilterPanelProps> = ({ actions, filters, properties }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <ReportsFilterHeader />
    <ReportsFilterGrid>
      <PropertyFilter properties={properties} filters={filters} actions={actions} />
      <RevenuePeriodFilter filters={filters} actions={actions} />
      <StatusFilter filters={filters} actions={actions} />
      <BookerNameFilter filters={filters} actions={actions} />
      <DateFilter label="Mulai Tanggal" value={filters.startDate} onChange={actions.setStartDate} />
      <DateFilter label="Sampai Tanggal" value={filters.endDate} onChange={actions.setEndDate} />
      <SortFilter filters={filters} actions={actions} />
      <ResetButton onReset={actions.resetFilters} />
    </ReportsFilterGrid>
  </div>
);

const ReportsFilterHeader = () => (
  <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
    <Filter className="h-5 w-5 text-slate-500" />
    <h3 className="font-semibold text-slate-900 dark:text-white">Filter Laporan</h3>
  </div>
);

const ReportsFilterGrid: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {children}
  </div>
);

const PropertyFilter: FC<ReportsFilterPanelProps> = ({ properties, filters, actions }) => (
  <FilterSelect label="Properti" value={filters.selectedPropertyId} onChange={actions.setSelectedPropertyId} options={getPropertyOptions(properties)} />
);

const RevenuePeriodFilter: FC<FilterSectionProps> = ({ filters, actions }) => (
  <FilterSelect label="Periode" value={filters.revenuePeriod} onChange={(value) => setRevenuePeriod(value, actions)} options={REPORT_REVENUE_PERIOD_OPTIONS} />
);

const StatusFilter: FC<FilterSectionProps> = ({ filters, actions }) => (
  <FilterSelect label="Status Transaksi" value={filters.selectedStatus} onChange={actions.setSelectedStatus} options={ORDER_STATUS_FILTER_OPTIONS} />
);

const BookerNameFilter: FC<FilterSectionProps> = ({ filters, actions }) => (
  <TextFilter label="Nama Pemesan" value={filters.userName} onChange={actions.setUserName} placeholder="Cari nama..." />
);

const DateFilter: FC<{ label: string; value: string; onChange: (value: string) => void }> = (props) => (
  <FilterDate label={props.label} value={props.value} onChange={props.onChange} />
);

const SortFilter: FC<FilterSectionProps> = ({ filters, actions }) => (
  <FilterSelect label="Urutan Transaksi" value={`${filters.sortBy}-${filters.sortOrder}`} onChange={(value) => applySort(value, actions)} options={REPORT_SORT_OPTIONS} />
);

const getPropertyOptions = (properties: TenantProperty[]) => [
  { value: "", label: "Semua Properti" },
  ...properties.map((property) => ({
    value: property.id,
    label: property.name,
  })),
];

const applySort = (value: string, actions: ReportsFilterActions) => {
  const [sortBy, sortOrder] = value.split("-");
  actions.setSortBy(sortBy);
  actions.setSortOrder(sortOrder as "asc" | "desc");
};

const setRevenuePeriod = (value: string, actions: ReportsFilterActions) =>
  actions.setRevenuePeriod(value as DashboardRevenuePeriod);

interface FilterSectionProps {
  actions: ReportsFilterActions;
  filters: ReportsFilters;
}

const ResetButton: FC<{ onReset: () => void }> = ({ onReset }) => (
  <div className="min-w-0">
    <div className="hidden xl:block invisible">
      <FilterLabel label="Aksi" />
    </div>
    <button
      onClick={onReset}
      className="mt-1 flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
    >
      Reset Filter
    </button>
  </div>
);
