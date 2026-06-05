import type { FC } from "react";
import { TenantOrdersContent } from "./orders/TenantOrdersContent";
import { useTenantOrdersPageState } from "@/hooks/tenant/orders/useTenantOrdersPageState";

const TenantOrdersPage: FC = () => {
  const { closeConfirm, ...state } = useTenantOrdersPageState();
  return <TenantOrdersContent closeConfirm={closeConfirm} state={state} />;
};

export default TenantOrdersPage;
