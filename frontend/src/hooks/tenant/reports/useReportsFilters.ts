import { useCallback, useMemo, useState } from "react";
import { DEFAULT_REVENUE_PERIOD } from "../tenant-dashboard/dashboardRevenuePeriod";
import type { ReportsFilterActions, ReportsFilters } from "./reportsTypes";

export const useReportsFilters = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [revenuePeriod, setRevenuePeriod] = useState(DEFAULT_REVENUE_PERIOD);
  const [userName, setUserName] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [reportPage, setReportPage] = useState(1);
  const resetFilters = useCallback(() => { setSelectedPropertyId(""); setSelectedStatus(""); setRevenuePeriod(DEFAULT_REVENUE_PERIOD); setUserName(""); setStartDate(""); setEndDate(""); setSortBy("created_at"); setSortOrder("desc"); }, []);
  const filters = useMemo<ReportsFilters>(() => ({ endDate, reportPage, revenuePeriod, selectedPropertyId, selectedStatus, sortBy, sortOrder, startDate, userName }), [endDate, reportPage, revenuePeriod, selectedPropertyId, selectedStatus, sortBy, sortOrder, startDate, userName]);
  const actions = useMemo<ReportsFilterActions>(() => ({ resetFilters, setEndDate, setReportPage, setRevenuePeriod, setSelectedPropertyId, setSelectedStatus, setSortBy, setSortOrder, setStartDate, setUserName }), [resetFilters]);
  return { actions, filters };
};
