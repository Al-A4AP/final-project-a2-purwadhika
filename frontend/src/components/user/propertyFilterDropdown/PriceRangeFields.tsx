import type { Dispatch, FC, SetStateAction } from 'react';
import { formatPrice } from '@/lib/formatters';
import type { PriceDraft } from './types';

interface PriceRangeFieldsProps {
  minPrice: PriceDraft;
  maxPrice: PriceDraft;
  setMinPrice: Dispatch<SetStateAction<PriceDraft>>;
  setMaxPrice: Dispatch<SetStateAction<PriceDraft>>;
}

const readPrice = (value: string): PriceDraft => (value === '' ? '' : Math.max(0, Number(value)));

const PriceInput: FC<{ placeholder: string; value: PriceDraft; onChange: (value: PriceDraft) => void }> = ({ placeholder, value, onChange }) => {
  const numericVal = Number(value);
  const showPreview = value !== '' && !isNaN(numericVal) && numericVal > 0;

  return (
    <div className="flex-1">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">Rp</span>
        <input type="number" min="0" step="50000" placeholder={placeholder} value={value} onChange={(event) => onChange(readPrice(event.target.value))} className="w-full pl-8 pr-3 py-2 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 dark:text-white" />
      </div>
      {showPreview && (
        <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400 text-center font-medium">
          {formatPrice(numericVal)}
        </p>
      )}
    </div>
  );
};

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
