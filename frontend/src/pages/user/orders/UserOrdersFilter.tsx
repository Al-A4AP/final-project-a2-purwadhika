import type { FC } from "react";
import { Search, Filter, Calendar } from "lucide-react";
import { CustomDatePickerPopup } from "@/components/common/CustomDatePickerPopup";
import { ORDER_STATUS_FILTER_OPTIONS } from "@/lib/constants";
import type { UserOrderFilterActions, UserOrderFilters } from "./userOrdersTypes";

interface UserOrdersFilterProps {
  actions: UserOrderFilterActions;
  filters: UserOrderFilters;
  onSearch: () => void;
}

const FIELD_ICON_CLASS = "pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400";
const INPUT_CLASS = "h-12 w-full rounded-xl border-none bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-red-500 dark:bg-slate-800 dark:text-white";

export const UserOrdersFilter: FC<UserOrdersFilterProps> = ({ actions, filters, onSearch }) => {
  const hasActiveFilter = hasFilters(filters);
  return (
    <div className="space-y-4">
      <FilterFields actions={actions} filters={filters} />
      <FilterButtons hasActiveFilter={hasActiveFilter} onReset={actions.resetFilters} onSearch={onSearch} />
    </div>
  );
};

const FilterFields: FC<FilterFieldsProps> = ({ actions, filters }) => (
  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
    <OrderNumberField value={filters.orderNumber} onChange={actions.setOrderNumber} />
    <StatusField value={filters.status} onChange={actions.setStatus} />
    <DateField label="Tanggal Check-in" value={filters.checkInDate} onChange={actions.setCheckInDate} />
    <DateField label="Tanggal Check-out" value={filters.checkOutDate} onChange={actions.setCheckOutDate} />
  </div>
);

const OrderNumberField: FC<TextFieldProps> = ({ onChange, value }) => (
  <div className="relative">
    <Search className={FIELD_ICON_CLASS} />
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Cari No. Reservasi"
      className={INPUT_CLASS}
    />
  </div>
);

const StatusField: FC<TextFieldProps> = ({ onChange, value }) => (
  <div className="relative">
    <Filter className={FIELD_ICON_CLASS} />
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`${INPUT_CLASS} appearance-none cursor-pointer`}
    >
      {ORDER_STATUS_FILTER_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
    </select>
  </div>
);

const DateField: FC<TextFieldProps & { label: string }> = ({ label, onChange, value }) => (
  <div className="relative">
    <Calendar className={FIELD_ICON_CLASS} />
    <CustomDatePickerPopup
      value={value}
      onChange={onChange}
      className={`${INPUT_CLASS} cursor-pointer`}
      placeholder={label}
    />
  </div>
);

const FilterButtons: FC<FilterButtonsProps> = ({ hasActiveFilter, onReset, onSearch }) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
    <button onClick={onSearch} className="h-12 rounded-xl bg-red-600 px-8 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 hover:shadow-md md:col-span-2">
      Terapkan Filter
    </button>
    <button onClick={onReset} disabled={!hasActiveFilter} className="h-12 rounded-xl bg-slate-100 px-8 text-sm font-bold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 md:col-span-2">
      Reset Semua
    </button>
  </div>
);

const hasFilters = (filters: UserOrderFilters) =>
  Boolean(filters.checkInDate || filters.checkOutDate || filters.orderNumber || filters.status);

interface FilterButtonsProps {
  hasActiveFilter: boolean;
  onReset: () => void;
  onSearch: () => void;
}

interface FilterFieldsProps {
  actions: UserOrderFilterActions;
  filters: UserOrderFilters;
}

interface TextFieldProps {
  onChange: (value: string) => void;
  value: string;
}
