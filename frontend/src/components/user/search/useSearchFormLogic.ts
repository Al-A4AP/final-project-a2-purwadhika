import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDateForInput } from "@/lib/formatters";
import { useFilterStore } from "@/stores/filterStore";
import { searchFormSchema, type SearchFormInput } from "@/validations/search";

type FilterStoreState = ReturnType<typeof useFilterStore.getState>;

const scrollToResults = () =>
  document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });

export const useSearchFormLogic = () => {
  const filters = useFilterStore();
  const [guestOpen, setGuestOpen] = useState(false);
  const form = useSearchFormDefaults(filters);
  const checkInVal = useWatch({ control: form.control, name: "check_in_date" });
  const dates = useSearchDates(checkInVal);
  const guests = useGuestSummary(filters.adults, filters.children, filters.babies);
  const onSubmit = (data: SearchFormInput) =>
    submitSearch(data, filters, guests.totalGuests, () => setGuestOpen(false));

  return { filters, form, guestOpen, setGuestOpen, dates, guests, onSubmit };
};

const useSearchFormDefaults = (filters: FilterStoreState) =>
  useForm<SearchFormInput>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      city: filters.city || "",
      check_in_date: filters.check_in_date || "",
      check_out_date: filters.check_out_date || "",
      adults: filters.adults ?? 1,
      children: filters.children ?? 0,
      babies: filters.babies ?? 0,
    },
  });

const useSearchDates = (checkInVal?: string) => {
  const today = useMemo(() => formatDateForInput(new Date()), []);
  const tomorrow = useMemo(() => {
    const now = new Date();
    return formatDateForInput(new Date(now.getTime() + 86400000));
  }, []);
  const checkoutMinDate = useMemo(() => getCheckoutMinDate(checkInVal, tomorrow), [checkInVal, tomorrow]);
  return { today, checkoutMinDate };
};

const getCheckoutMinDate = (checkInVal: string | undefined, tomorrow: string) => {
  if (!checkInVal) return tomorrow;
  return formatDateForInput(new Date(new Date(checkInVal).getTime() + 86400000));
};

const useGuestSummary = (adults: number, children: number, babies: number) => {
  const totalGuests = adults + children;
  const guestSummary = [`${adults} Dewasa`, children > 0 ? `${children} Anak` : "", babies > 0 ? `${babies} Bayi` : ""]
    .filter(Boolean)
    .join(", ");
  return { guestSummary, totalGuests };
};

const submitSearch = (
  data: SearchFormInput,
  filters: FilterStoreState,
  totalGuests: number,
  closeGuests: () => void,
) => {
  filters.setCity(data.city || "");
  filters.setCheckInDate(data.check_in_date || "");
  filters.setCheckOutDate(data.check_out_date || "");
  filters.setAdults(filters.adults);
  filters.setChildren(filters.children);
  filters.setBabies(filters.babies);
  filters.setCapacity(totalGuests || 1);
  filters.applyFilters();
  closeGuests();
  scrollToResults();
};
