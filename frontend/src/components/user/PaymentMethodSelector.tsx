import type { FC } from 'react';
import { CreditCard, Wallet } from 'lucide-react';

interface Props {
  paymentMethod: 'MANUAL' | 'MIDTRANS';
  onChange: (method: 'MANUAL' | 'MIDTRANS') => void;
}

export const PaymentMethodSelector: FC<Props> = ({ paymentMethod, onChange }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border dark:border-slate-700">
    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Metode Pembayaran</h2>
    <div className="space-y-3">
      <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === 'MIDTRANS' ? 'border-red-600 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-slate-700'}`}>
        <input type="radio" name="payment" checked={paymentMethod === 'MIDTRANS'} onChange={() => onChange('MIDTRANS')} className="text-red-600 focus:ring-red-500" />
        <CreditCard className={paymentMethod === 'MIDTRANS' ? 'text-red-600' : 'text-gray-400'} />
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">Bayar Otomatis (Midtrans)</p>
          <p className="text-sm text-gray-500">Kartu Kredit, GoPay, BCA Virtual Account, dll.</p>
        </div>
      </label>
      <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === 'MANUAL' ? 'border-red-600 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-slate-700'}`}>
        <input type="radio" name="payment" checked={paymentMethod === 'MANUAL'} onChange={() => onChange('MANUAL')} className="text-red-600 focus:ring-red-500" />
        <Wallet className={paymentMethod === 'MANUAL' ? 'text-red-600' : 'text-gray-400'} />
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">Transfer Manual</p>
          <p className="text-sm text-gray-500">Transfer ke rekening bank dan unggah bukti pembayaran.</p>
        </div>
      </label>
    </div>
  </div>
);
