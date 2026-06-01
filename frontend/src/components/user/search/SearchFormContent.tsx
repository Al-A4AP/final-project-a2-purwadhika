import type { FC } from "react";
import type { useSearchFormLogic } from "./useSearchFormLogic";
import { CityField } from "./CityField";
import { DateField } from "./DateField";
import { GuestSelector } from "./GuestSelector";
import { SearchSubmitButton } from "./SearchSubmitButton";
import { SEARCH_FORM_GRID_CLASS, SEARCH_FORM_WRAPPER_CLASS } from "./searchFormStyles";

type SearchFormState = ReturnType<typeof useSearchFormLogic>;
export type SearchFormVariant = keyof typeof SEARCH_FORM_WRAPPER_CLASS;

interface SearchFormContentProps {
  state: SearchFormState;
  variant?: SearchFormVariant;
}

export const SearchFormContent: FC<SearchFormContentProps> = ({ state, variant = "card" }) => {
  return <div className={SEARCH_FORM_WRAPPER_CLASS[variant]}><SearchFormFields state={state} /></div>;
};

const SearchFormFields: FC<{ state: SearchFormState }> = ({ state }) => {
  const { filters, form, guestOpen, setGuestOpen, dates, guests, onSubmit } = state;
  const { register, handleSubmit, formState: { errors } } = form;
  return <form onSubmit={handleSubmit(onSubmit)}><div className={SEARCH_FORM_GRID_CLASS}><CityField register={register} errors={errors} /><DateField label="Check-in" name="check_in_date" min={dates.today} register={register} error={errors.check_in_date} /><DateField label="Check-out" name="check_out_date" min={dates.checkoutMinDate} register={register} error={errors.check_out_date} /><GuestSelector adults={filters.adults} babies={filters.babies} children={filters.children} guestSummary={guests.guestSummary} isOpen={guestOpen} onClose={() => setGuestOpen(false)} onToggle={() => setGuestOpen((open) => !open)} setAdults={filters.setAdults} setBabies={filters.setBabies} setChildren={filters.setChildren} /><SearchSubmitButton /></div></form>;
};
