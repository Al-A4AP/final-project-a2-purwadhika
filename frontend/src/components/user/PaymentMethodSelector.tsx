import type { FC, ReactNode } from 'react';
import { CreditCard, Wallet } from 'lucide-react';
import { HelpText } from '@/components/common/HelpText';

type PaymentMethod = 'MANUAL' | 'MIDTRANS';

interface Props {
  paymentMethod: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector: FC<Props> = (props) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border dark:border-slate-700">
    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Metode Pembayaran</h2>
    <PaymentHelp />
    <div className="space-y-3">
      {paymentOptions.map((option) => <PaymentOption key={option.method} option={option} {...props} />)}
    </div>
  </div>
);

const PaymentHelp = () => (
  <HelpText className="mb-4">Transfer manual perlu bukti bayar; pesanan otomatis dibatalkan jika bukti belum diunggah tepat waktu.</HelpText>
);

const PaymentOption: FC<PaymentOptionProps> = ({ option, paymentMethod, onChange }) => {
  const selected = paymentMethod === option.method;
  return (
    <label className={getOptionClass(selected)} title={option.title}>
      <input type="radio" name="payment" checked={selected} onChange={() => onChange(option.method)} className="text-red-600 focus:ring-red-500" aria-label={option.title} />
      <OptionIcon selected={selected}>{option.icon}</OptionIcon>
      <OptionCopy title={option.title} description={option.description} />
    </label>
  );
};

const OptionIcon: FC<{ selected: boolean; children: ReactNode }> = ({ selected, children }) => (
  <span className={selected ? 'text-red-600' : 'text-gray-400'}>{children}</span>
);

const OptionCopy: FC<Pick<PaymentOptionItem, 'title' | 'description'>> = ({ title, description }) => (
  <div>
    <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

const getOptionClass = (selected: boolean) =>
  `flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${selected ? selectedClass : unselectedClass}`;

const paymentOptions: PaymentOptionItem[] = [
  { method: 'MIDTRANS', title: 'Bayar Otomatis (Midtrans)', description: 'Kartu Kredit, GoPay, BCA Virtual Account, dll.', icon: <CreditCard /> },
  { method: 'MANUAL', title: 'Transfer Manual', description: 'Transfer ke rekening bank dan unggah bukti pembayaran.', icon: <Wallet /> },
];

const selectedClass = 'border-red-600 bg-red-50 dark:bg-red-900/10';
const unselectedClass = 'border-gray-200 dark:border-slate-700';

interface PaymentOptionItem {
  method: PaymentMethod;
  title: string;
  description: string;
  icon: ReactNode;
}

interface PaymentOptionProps extends Props {
  option: PaymentOptionItem;
}
