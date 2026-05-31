import type { FC } from "react";
import { OrdersDesktopTable } from "./orders-table/OrdersDesktopTable";
import { OrdersMobileList } from "./orders-table/OrdersMobileList";
import type { OrdersTableViewProps } from "./orders-table/types";

export const OrdersTable: FC<OrdersTableViewProps> = (props) => (
  <>
    <OrdersMobileList {...props} />
    <OrdersDesktopTable {...props} />
  </>
);
