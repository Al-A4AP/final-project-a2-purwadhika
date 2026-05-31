import type { FC } from "react";
import { OrdersFilterDate } from "./OrdersFilterDate";

interface OrdersDateRangeFieldsProps {
  endDate: string;
  setEndDate: (value: string) => void;
  setStartDate: (value: string) => void;
  startDate: string;
}

export const OrdersDateRangeFields: FC<OrdersDateRangeFieldsProps> = ({ endDate, setEndDate, setStartDate, startDate }) => (
  <>
    <OrdersFilterDate label="Mulai Tanggal" value={startDate} onChange={setStartDate} />
    <OrdersFilterDate label="Sampai Tanggal" value={endDate} onChange={setEndDate} />
  </>
);
