import type { FC } from "react";
import { UserOrdersContent } from "./orders/UserOrdersContent";
import { useUserOrdersPageState } from "./orders/useUserOrdersPageState";

const OrdersPage: FC = () => {
  const { fileInputRef, state } = useUserOrdersPageState();
  return <UserOrdersContent fileInputRef={fileInputRef} state={state} />;
};

export default OrdersPage;
