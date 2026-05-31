import type { FC } from "react";
import { OrdersFilter } from "@/components/tenant/OrdersFilter";
import type { TenantOrdersState } from "./tenantOrdersTypes";

export const TenantOrdersFilterPanel: FC<{ state: TenantOrdersState }> = ({ state }) => <OrdersFilter properties={state.properties} selectedPropertyId={state.filters.selectedPropertyId} setSelectedPropertyId={state.filterActions.setSelectedPropertyId} selectedStatus={state.filters.selectedStatus} setSelectedStatus={state.filterActions.setSelectedStatus} startDate={state.filters.startDate} setStartDate={state.filterActions.setStartDate} endDate={state.filters.endDate} setEndDate={state.filterActions.setEndDate} sortBy={state.filters.sortBy} setSortBy={state.filterActions.setSortBy} sortOrder={state.filters.sortOrder} setSortOrder={state.filterActions.setSortOrder} resetFilters={state.filterActions.resetFilters} />;
