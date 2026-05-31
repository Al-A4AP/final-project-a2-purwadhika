import type { FC } from "react";
import type { TenantProperty } from "@/types";
import { OrdersFilterField } from "./OrdersFilterField";
import { OrdersFilterSelect } from "./OrdersFilterSelect";
import type { SelectOption } from "./types";

const toPropertyOptions = (properties: TenantProperty[]): SelectOption[] => [
  { value: "", label: "Semua Properti" },
  ...properties.map((property) => ({ value: property.id, label: property.name })),
];

export const OrdersPropertySelect: FC<{ onChange: (value: string) => void; properties: TenantProperty[]; value: string }> = ({ onChange, properties, value }) => (
  <OrdersFilterField label="Properti" className="sm:col-span-2 xl:col-span-1">
    <OrdersFilterSelect value={value} onChange={onChange} options={toPropertyOptions(properties)} />
  </OrdersFilterField>
);
