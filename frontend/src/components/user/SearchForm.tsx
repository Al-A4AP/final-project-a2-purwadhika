import type { FC } from "react";
import { SearchFormContent, type SearchFormVariant } from "./search/SearchFormContent";
import { useSearchFormLogic, type SearchSubmitMode } from "./search/useSearchFormLogic";

interface SearchFormProps {
  submitMode?: SearchSubmitMode;
  variant?: SearchFormVariant;
}

const SearchForm: FC<SearchFormProps> = ({ submitMode, variant }) =>
  <SearchFormContent state={useSearchFormLogic({ submitMode })} variant={variant} />;

export default SearchForm;
