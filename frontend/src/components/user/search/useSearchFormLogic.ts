import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch, type UseFormReturn } from "react-hook-form";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDateForInput } from "@/lib/formatters";
import { useFilterStore, type FilterValues } from "@/stores/filterStore";
import { searchFormSchema, type SearchFormInput } from "@/validations/search";

type FilterStoreState = ReturnType<typeof useFilterStore.getState>;
type SearchFormValues = Partial<Pick<SearchFormInput, "adults" | "babies" | "check_in_date" | "check_out_date" | "children" | "city">>;
export type SearchSubmitMode = "explore" | "scroll";

interface SearchFormLogicOptions {
  onSubmitted?: () => void;
  submitMode?: SearchSubmitMode;
}

const scrollToResults = () =>
  document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });

export const useSearchFormLogic = (options: SearchFormLogicOptions = {}) => {
  const filters = useFilterStore();
  const navigate = useNavigate();
  const [guestOpen, setGuestOpen] = useState(false);
  const search = useSearchFormState(filters);
  const guests = useGuestSummary(filters.adults, filters.children, filters.babies);
  const onSubmit = createSubmitHandler(data => submitSearch(
    data,
    { filters, navigate, submitMode: options.submitMode || "scroll", totalGuests: guests.totalGuests },
    () => setGuestOpen(false),
  ), options.onSubmitted);
  return { dates: search.dates, filters, form: search.form, guestOpen, guests, onSubmit, setGuestOpen };
};

const createSubmitHandler = (
  submit: (data: SearchFormInput) => void,
  onSubmitted?: () => void,
) => (data: SearchFormInput) => {
  submit(data);
  onSubmitted?.();
};

const useSearchFormDefaults = (filters: FilterStoreState) =>
  useForm<SearchFormInput>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: toSearchFormValues(filters),
  });

const useSearchFormState = (filters: FilterStoreState) => {
  const form = useSearchFormDefaults(filters);
  useSyncSearchForm(form, filters.activeFilters, filters.appliedAt);
  const checkInVal = useWatch({ control: form.control, name: "check_in_date" });
  return { dates: useSearchDates(checkInVal), form };
};

const useSyncSearchForm = (form: UseFormReturn<SearchFormInput>, values: SearchFormValues, appliedAt: number) => {
  useEffect(() => {
    form.reset(toSearchFormValues(values));
  }, [appliedAt, form, values]);
};

const toSearchFormValues = (values: SearchFormValues): SearchFormInput => ({
  city: values.city || "",
  check_in_date: values.check_in_date || "",
  check_out_date: values.check_out_date || "",
  adults: values.adults ?? 1,
  children: values.children ?? 0,
  babies: values.babies ?? 0,
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
  options: SubmitSearchOptions,
  closeGuests: () => void,
) => {
  applySearchValues(data, options.filters, options.totalGuests);
  options.filters.applyFilters();
  closeGuests();
  handleSubmitNavigation(options);
};

const handleSubmitNavigation = (options: SubmitSearchOptions) => {
  if (options.submitMode === "explore") return options.navigate(buildExploreUrl(options.filters.getFilterValues()));
  scrollToResults();
};

const applySearchValues = (data: SearchFormInput, filters: FilterStoreState, totalGuests: number) => {
  filters.setCity(data.city || "");
  filters.setCheckInDate(data.check_in_date || "");
  filters.setCheckOutDate(data.check_out_date || "");
  filters.setAdults(filters.adults);
  filters.setChildren(filters.children);
  filters.setBabies(filters.babies);
  filters.setCapacity(totalGuests || 1);
};

const buildExploreUrl = (values: FilterValues) => {
  const query = new URLSearchParams();
  appendQuery(query, "city", values.city);
  appendQuery(query, "check_in_date", values.check_in_date);
  appendQuery(query, "check_out_date", values.check_out_date);
  appendQuery(query, "adults", values.adults);
  appendQuery(query, "children", values.children);
  appendQuery(query, "babies", values.babies);
  appendQuery(query, "capacity", values.capacity);
  return `/explore${query.toString() ? `?${query}` : ""}`;
};

const appendQuery = (query: URLSearchParams, key: string, value?: number | string) => {
  if (value === undefined || value === "") return;
  query.set(key, String(value));
};

interface SubmitSearchOptions {
  filters: FilterStoreState;
  navigate: NavigateFunction;
  submitMode: SearchSubmitMode;
  totalGuests: number;
}
