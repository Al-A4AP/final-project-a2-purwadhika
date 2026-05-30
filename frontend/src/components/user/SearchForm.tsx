import type { FC } from "react";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, MapPin, Calendar, Users, ChevronDown } from "lucide-react";
import { searchFormSchema, type SearchFormInput } from "@/validations/search";
import { useFilterStore } from "@/stores/filterStore";
import { CITIES } from "@/lib/constants";
import { formatDateForInput } from "@/lib/formatters";

import { GuestCounter } from "@/components/common/GuestCounter";

const SearchForm: FC = () => {
  const filters = useFilterStore();
  const [guestOpen, setGuestOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SearchFormInput>({
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

  const { today, tomorrow } = useMemo(() => {
    const now = new Date();
    return {
      today: formatDateForInput(now),
      tomorrow: formatDateForInput(new Date(now.getTime() + 86400000)),
    };
  }, []);

  const checkInVal = useWatch({ control, name: "check_in_date" });
  const checkoutMinDate = useMemo(() => {
    if (!checkInVal) return tomorrow;
    const cid = new Date(checkInVal);
    return formatDateForInput(new Date(cid.getTime() + 86400000));
  }, [checkInVal, tomorrow]);

  const totalGuests = filters.adults + filters.children;
  const guestSummary = [
    `${filters.adults} Dewasa`,
    filters.children > 0 ? `${filters.children} Anak` : "",
    filters.babies > 0 ? `${filters.babies} Bayi` : "",
  ]
    .filter(Boolean)
    .join(", ");

  const onSubmit = (data: SearchFormInput) => {
    filters.setCity(data.city || "");
    filters.setCheckInDate(data.check_in_date || "");
    filters.setCheckOutDate(data.check_out_date || "");
    filters.setAdults(filters.adults);
    filters.setChildren(filters.children);
    filters.setBabies(filters.babies);
    filters.setCapacity(totalGuests || 1);
    filters.applyFilters();
    setGuestOpen(false);
    document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* Kota */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="inline mr-1" size={16} /> Kota
            </label>
            <select {...register("city")} className={inputClass}>
              <option value="">Pilih kota</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
            )}
          </div>

          {/* Check-in */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline mr-1" size={16} /> Check-in
            </label>
            <input
              type="date"
              {...register("check_in_date")}
              min={today}
              className={inputClass}
            />
            {errors.check_in_date && (
              <p className="text-red-500 text-xs mt-1">
                {errors.check_in_date.message}
              </p>
            )}
          </div>

          {/* Check-out */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline mr-1" size={16} /> Check-out
            </label>
            <input
              type="date"
              {...register("check_out_date")}
              min={checkoutMinDate}
              className={inputClass}
            />
            {errors.check_out_date && (
              <p className="text-red-500 text-xs mt-1">
                {errors.check_out_date.message}
              </p>
            )}
          </div>

          {/* Guest Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Users className="inline mr-1" size={16} /> Tamu
            </label>
            <button
              type="button"
              onClick={() => setGuestOpen(!guestOpen)}
              className={`${inputClass} flex items-center justify-between text-left`}
            >
              <span className="text-sm truncate">
                {guestSummary || "1 Dewasa"}
              </span>
              <ChevronDown
                size={16}
                className={`shrink-0 ml-1 transition-transform ${guestOpen ? "rotate-180" : ""}`}
              />
            </button>

            {guestOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-xl shadow-xl z-50 p-4 min-w-65">
                <GuestCounter
                  label="Dewasa"
                  description="Usia 13 tahun ke atas"
                  value={filters.adults}
                  onChange={filters.setAdults}
                  min={1}
                />
                <GuestCounter
                  label="Anak-anak"
                  description="Usia 2 – 12 tahun"
                  value={filters.children}
                  onChange={filters.setChildren}
                  max={filters.adults}
                />
                <GuestCounter
                  label="Bayi"
                  description="Di bawah 2 tahun"
                  value={filters.babies}
                  onChange={filters.setBabies}
                  max={filters.adults}
                />
                <button
                  type="button"
                  onClick={() => setGuestOpen(false)}
                  className="mt-3 w-full text-center text-sm text-red-600 font-medium hover:underline"
                >
                  Selesai
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
            <Search size={18} /> Cari
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
