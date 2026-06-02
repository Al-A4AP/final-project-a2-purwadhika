import type { PropertyDetailFilters } from "./detailTypes";

export const parseDateFilters = (filters?: PropertyDetailFilters) => ({
  checkIn: filters?.check_in_date ? new Date(filters.check_in_date) : null,
  checkOut: filters?.check_out_date ? new Date(filters.check_out_date) : null,
});

export const getDefaultCalendarRange = () => {
  const now = new Date();
  return {
    start: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)),
    end: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 0)),
  };
};
