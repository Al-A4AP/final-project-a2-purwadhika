import type { FC } from "react";
import { UserOrdersContent } from "./orders/UserOrdersContent";
import { useUserOrdersPageState } from "@/hooks/user/orders/useUserOrdersPageState";

const OrdersPage: FC = () => {
  const { fileInputRef, state } = useUserOrdersPageState();
  return <UserOrdersContent fileInputRef={fileInputRef} state={state} />;
};

export default OrdersPage;
