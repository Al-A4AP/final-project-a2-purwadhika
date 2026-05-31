import type { FC } from "react";
import { Search } from "lucide-react";

export const SearchSubmitButton: FC = () => (
  <button
    type="submit"
    className="w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
  >
    <Search size={18} /> Cari
  </button>
);
