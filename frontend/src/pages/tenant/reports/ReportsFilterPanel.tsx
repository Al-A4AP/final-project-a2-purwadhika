import type { FC, ReactNode } from "react";
import { ORDER_STATUS_FILTER_OPTIONS } from "@/lib/constants";
import type { DashboardRevenuePeriod, TenantProperty } from "@/types";
import {
  REPORT_REVENUE_PERIOD_OPTIONS,
  REPORT_SORT_OPTIONS,
} from "./reportOptions";
import type { ReportsFilterActions, ReportsFilters } from "./reportsTypes";
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
);

const ReportsFilterGrid: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 gap-4 rounded-xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-2 xl:grid-cols-8">
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
    <div className="invisible">
      <FilterLabel label="Aksi" />
    </div>
    <button
      onClick={onReset}
      className="h-10 w-full rounded-lg border bg-white px-4 text-sm text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-700"
    >
      Reset
    </button>
  </div>
);
