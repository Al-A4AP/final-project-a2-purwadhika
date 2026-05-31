import type { Dispatch, FC, SetStateAction } from 'react';
import type { PropertyCategory } from '@/types';

interface SearchCategoryFieldsProps {
  search: string;
  category: string;
  categories: PropertyCategory[];
  setSearch: Dispatch<SetStateAction<string>>;
  setCategory: Dispatch<SetStateAction<string>>;
}

const fieldClass = 'w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white';

export const SearchCategoryFields: FC<SearchCategoryFieldsProps> = ({ search, category, categories, setSearch, setCategory }) => (
  <section className="space-y-3">
    <div>
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Nama Properti</h4>
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama properti" className={fieldClass} />
    </div>
    <div>
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Kategori</h4>
      <select value={category} onChange={(event) => setCategory(event.target.value)} className={fieldClass}>
        <option value="">Semua kategori</option>
        {categories.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
      </select>
    </div>
  </section>
);
