import type { FC } from "react";
import { ORDER_STATUS_FILTER_OPTIONS } from "@/lib/constants";
import { OrdersFilterField } from "./OrdersFilterField";
import { OrdersFilterSelect } from "./OrdersFilterSelect";

export const OrdersStatusSelect: FC<{ onChange: (value: string) => void; value: string }> = ({ onChange, value }) => (
  <OrdersFilterField label="Status">
    <OrdersFilterSelect value={value} onChange={onChange} options={ORDER_STATUS_FILTER_OPTIONS} />
  </OrdersFilterField>
);
