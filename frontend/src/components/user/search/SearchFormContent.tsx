import type { FC } from "react";
import type { useSearchFormLogic } from "./useSearchFormLogic";
import { CityField } from "./CityField";
import { DateField } from "./DateField";
import { GuestSelector } from "./GuestSelector";
import { SearchSubmitButton } from "./SearchSubmitButton";
import { SEARCH_FORM_GRID_CLASS, SEARCH_FORM_STACKED_GRID_CLASS, SEARCH_FORM_WRAPPER_CLASS } from "./searchFormStyles";

type SearchFormState = ReturnType<typeof useSearchFormLogic>;
export type SearchFormLayout = "responsive" | "stacked";
export type SearchFormVariant = keyof typeof SEARCH_FORM_WRAPPER_CLASS;

interface SearchFormContentProps {
  layout?: SearchFormLayout;
  state: SearchFormState;
  variant?: SearchFormVariant;
}

export const SearchFormContent: FC<SearchFormContentProps> = ({ layout = "responsive", state, variant = "card" }) => {
  return <div className={SEARCH_FORM_WRAPPER_CLASS[variant]}><SearchFormFields layout={layout} state={state} /></div>;
};

const SearchFormFields: FC<{ layout: SearchFormLayout; state: SearchFormState }> = ({ layout, state }) => {
  const { filters, form, guestOpen, setGuestOpen, dates, guests, onSubmit } = state;
  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;
  return <form onSubmit={handleSubmit(onSubmit)}><div className={getGridClass(layout)}><CityField register={register} errors={errors} setValue={setValue} watch={watch} /><DateField label="Check-in" name="check_in_date" min={dates.today} control={form.control} error={errors.check_in_date} /><DateField label="Check-out" name="check_out_date" min={dates.checkoutMinDate} control={form.control} error={errors.check_out_date} /><GuestSelector adults={filters.adults} babies={filters.babies} children={filters.children} guestSummary={guests.guestSummary} isOpen={guestOpen} onClose={() => setGuestOpen(false)} onToggle={() => setGuestOpen((open) => !open)} setAdults={filters.setAdults} setBabies={filters.setBabies} setChildren={filters.setChildren} /><SearchSubmitButton /></div></form>;
};

const getGridClass = (layout: SearchFormLayout) =>
  layout === "stacked" ? SEARCH_FORM_STACKED_GRID_CLASS : SEARCH_FORM_GRID_CLASS;
