import { useMemo, useState } from "react";
import type { OccupancyProperty } from "@/services/tenantReportService";

const PROPERTY_PAGE_SIZE = 8;

export const usePerformancePage = (data: OccupancyProperty[]) => {
  const [currentPage, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / PROPERTY_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const items = useMemo(() => getPageItems(data, safePage), [data, safePage]);
  return { currentPage: safePage, items, setPage, totalPages };
};

const getPageItems = (data: OccupancyProperty[], page: number) => {
  const start = (page - 1) * PROPERTY_PAGE_SIZE;
  return data.slice(start, start + PROPERTY_PAGE_SIZE);
};

export type PerformancePage = ReturnType<typeof usePerformancePage>;
