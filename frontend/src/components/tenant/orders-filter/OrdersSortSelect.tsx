import type { FC } from "react";
import { OrdersFilterField } from "./OrdersFilterField";
import { OrdersFilterSelect } from "./OrdersFilterSelect";
import { ORDER_SORT_OPTIONS, parseSortValue } from "./sortOptions";
import type { SortOrder } from "./types";

interface OrdersSortSelectProps {
  setSortBy: (value: string) => void;
  setSortOrder: (value: SortOrder) => void;
  sortBy: string;
  sortOrder: SortOrder;
}

const applySortValue = (value: string, setSortBy: (value: string) => void, setSortOrder: (value: SortOrder) => void) => {
  const parsed = parseSortValue(value);
  setSortBy(parsed.sortBy);
  setSortOrder(parsed.sortOrder);
};

export const OrdersSortSelect: FC<OrdersSortSelectProps> = ({ setSortBy, setSortOrder, sortBy, sortOrder }) => (
  <OrdersFilterField label="Urutkan">
    <OrdersFilterSelect value={`${sortBy}-${sortOrder}`} onChange={(value) => applySortValue(value, setSortBy, setSortOrder)} options={ORDER_SORT_OPTIONS} />
  </OrdersFilterField>
);
