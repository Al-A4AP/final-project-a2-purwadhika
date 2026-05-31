import type { FC } from "react";
import type { TenantProperty } from "@/types";
import { OrdersDateRangeFields } from "./orders-filter/OrdersDateRangeFields";
import { OrdersFilterResetButton } from "./orders-filter/OrdersFilterResetButton";
import { OrdersPropertySelect } from "./orders-filter/OrdersPropertySelect";
import { OrdersSortSelect } from "./orders-filter/OrdersSortSelect";
import { OrdersStatusSelect } from "./orders-filter/OrdersStatusSelect";

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

export const OrdersFilter: FC<OrdersFilterProps> = (props) => (
  <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-2 xl:grid-cols-6">
    <OrdersPropertySelect properties={props.properties} value={props.selectedPropertyId} onChange={props.setSelectedPropertyId} />
    <OrdersStatusSelect value={props.selectedStatus} onChange={props.setSelectedStatus} />
    <OrdersDateRangeFields startDate={props.startDate} setStartDate={props.setStartDate} endDate={props.endDate} setEndDate={props.setEndDate} />
    <OrdersSortSelect sortBy={props.sortBy} sortOrder={props.sortOrder} setSortBy={props.setSortBy} setSortOrder={props.setSortOrder} />
    <OrdersFilterResetButton onReset={props.resetFilters} />
  </div>
);
