import type { FC } from "react";
import { SearchFormContent } from "./search/SearchFormContent";
import { useSearchFormLogic } from "./search/useSearchFormLogic";

const SearchForm: FC = () => <SearchFormContent state={useSearchFormLogic()} />;

export default SearchForm;
