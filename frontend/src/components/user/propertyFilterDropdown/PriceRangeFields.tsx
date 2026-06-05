import type { Dispatch, FC, SetStateAction } from 'react';
import { formatCurrencyInputValue, readCurrencyInputValue } from '@/lib/currencyInput';
import type { PriceDraft } from './types';

interface PriceRangeFieldsProps {
  minPrice: PriceDraft;
  maxPrice: PriceDraft;
  setMinPrice: Dispatch<SetStateAction<PriceDraft>>;
  setMaxPrice: Dispatch<SetStateAction<PriceDraft>>;
}

const readPrice = (value: string): PriceDraft => {
  const digits = readCurrencyInputValue(value);
  return digits === '' ? '' : Math.max(0, Number(digits));
};

const PriceInput: FC<{ placeholder: string; value: PriceDraft; onChange: (value: PriceDraft) => void }> = ({ placeholder, value, onChange }) => (
  <div className="flex-1">
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">Rp</span>
      <input type="text" inputMode="numeric" placeholder={placeholder} value={formatCurrencyInputValue(value)} onChange={(event) => onChange(readPrice(event.target.value))} className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
    </div>
  </div>
);

export const PriceRangeFields: FC<PriceRangeFieldsProps> = ({ minPrice, maxPrice, setMinPrice, setMaxPrice }) => (
  <section>
    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Rentang Harga (Malam)</h4>
    <div className="flex items-center gap-3">
      <PriceInput placeholder="Min" value={minPrice} onChange={setMinPrice} />
      <span className="text-slate-300">-</span>
      <PriceInput placeholder="Maks" value={maxPrice} onChange={setMaxPrice} />
    </div>
  </section>
);
