import type { FC } from "react";
import { SearchFormContent, type SearchFormLayout, type SearchFormVariant } from "./search/SearchFormContent";
import { useSearchFormLogic, type SearchSubmitMode } from "./search/useSearchFormLogic";

interface SearchFormProps {
  layout?: SearchFormLayout;
  onSubmitted?: () => void;
  submitMode?: SearchSubmitMode;
  variant?: SearchFormVariant;
}

const SearchForm: FC<SearchFormProps> = ({ layout, onSubmitted, submitMode, variant }) =>
  <SearchFormContent layout={layout} state={useSearchFormLogic({ onSubmitted, submitMode })} variant={variant} />;

export default SearchForm;
