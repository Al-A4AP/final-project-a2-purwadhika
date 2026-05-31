import type { FC } from "react";
import type { useSearchFormLogic } from "./useSearchFormLogic";
import { CityField } from "./CityField";
import { DateField } from "./DateField";
import { GuestSelector } from "./GuestSelector";
import { SearchSubmitButton } from "./SearchSubmitButton";

type SearchFormState = ReturnType<typeof useSearchFormLogic>;

export const SearchFormContent: FC<{ state: SearchFormState }> = ({ state }) => {
  const { filters, form, guestOpen, setGuestOpen, dates, guests, onSubmit } = state;
  const { register, handleSubmit, formState: { errors } } = form;
  return <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8"><form onSubmit={handleSubmit(onSubmit)}><div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"><CityField register={register} errors={errors} /><DateField label="Check-in" name="check_in_date" min={dates.today} register={register} error={errors.check_in_date} /><DateField label="Check-out" name="check_out_date" min={dates.checkoutMinDate} register={register} error={errors.check_out_date} /><GuestSelector adults={filters.adults} babies={filters.babies} children={filters.children} guestSummary={guests.guestSummary} isOpen={guestOpen} onClose={() => setGuestOpen(false)} onToggle={() => setGuestOpen((open) => !open)} setAdults={filters.setAdults} setBabies={filters.setBabies} setChildren={filters.setChildren} /><SearchSubmitButton /></div></form></div>;
};
