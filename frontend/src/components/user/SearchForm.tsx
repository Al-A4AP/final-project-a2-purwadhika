import type { FC } from "react";
import { SearchFormContent, type SearchFormVariant } from "./search/SearchFormContent";
import { useSearchFormLogic } from "./search/useSearchFormLogic";

interface SearchFormProps {
  variant?: SearchFormVariant;
}

const SearchForm: FC<SearchFormProps> = ({ variant }) =>
  <SearchFormContent state={useSearchFormLogic()} variant={variant} />;

export default SearchForm;
