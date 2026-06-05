import { useCallback, useMemo, useState } from "react";
import type { TenantOrderFilterActions, TenantOrderFilters } from "../../../pages/tenant/orders/tenantOrdersTypes";

export const useTenantOrderFilters = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const resetFilters = useCallback(() => { setSelectedPropertyId(""); setSelectedStatus(""); setStartDate(""); setEndDate(""); setSortBy("created_at"); setSortOrder("desc"); }, []);
  const values = useMemo<TenantOrderFilters>(() => ({ endDate, selectedPropertyId, selectedStatus, sortBy, sortOrder, startDate }), [endDate, selectedPropertyId, selectedStatus, sortBy, sortOrder, startDate]);
  const actions = useMemo<TenantOrderFilterActions>(() => ({ resetFilters, setEndDate, setSelectedPropertyId, setSelectedStatus, setSortBy, setSortOrder, setStartDate }), [resetFilters]);
  return { actions, values };
};
