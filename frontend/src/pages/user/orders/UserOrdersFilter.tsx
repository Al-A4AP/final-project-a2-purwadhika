import type { FC } from "react";
import { CustomDatePickerPopup } from "@/components/common/CustomDatePickerPopup";
import { ORDER_STATUS_FILTER_OPTIONS } from "@/lib/constants";
import type { UserOrderFilterActions, UserOrderFilters } from "./userOrdersTypes";

interface UserOrdersFilterProps {
  actions: UserOrderFilterActions;
  filters: UserOrderFilters;
  onSearch: () => void;
}

const INPUT_CLASS = "px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm";

export const UserOrdersFilter: FC<UserOrdersFilterProps> = ({ actions, filters, onSearch }) => (
  <div className="grid md:grid-cols-5 gap-3 mb-6 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-4">
    <input value={filters.orderNumber} onChange={(event) => actions.setOrderNumber(event.target.value)} placeholder="Nomor order" className={INPUT_CLASS} />
    <StatusSelect value={filters.status} onChange={actions.setStatus} />
    <CustomDatePickerPopup value={filters.startDate} onChange={actions.setStartDate} className={INPUT_CLASS} placeholder="Mulai" />
    <CustomDatePickerPopup value={filters.endDate} onChange={actions.setEndDate} className={INPUT_CLASS} placeholder="Sampai" />
    <button onClick={onSearch} className="bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">Cari</button>
  </div>
);

const StatusSelect: FC<{ onChange: (value: string) => void; value: string }> = ({ onChange, value }) => (
  <select value={value} onChange={(event) => onChange(event.target.value)} className={INPUT_CLASS}>
    {ORDER_STATUS_FILTER_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
  </select>
);
