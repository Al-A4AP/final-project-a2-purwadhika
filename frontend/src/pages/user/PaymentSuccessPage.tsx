import type { FC } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PaymentSuccessPage: FC = () => {
  const navigate = usePaymentSuccessRedirect();

  return <PaymentSuccessLayout navigate={navigate} />;
};

const usePaymentSuccessRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => startPaymentRedirect(navigate), [navigate]);
  return navigate;
};

const startPaymentRedirect = (navigate: ReturnType<typeof useNavigate>) => {
  toast.success('Pembayaran Berhasil diproses!');
  const timer = setTimeout(() => navigate('/orders'), 3000);
  return () => clearTimeout(timer);
};

const PaymentSuccessLayout: FC<PaymentSuccessLayoutProps> = ({ navigate }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
    <PaymentSuccessCard navigate={navigate} />
  </div>
);

const PaymentSuccessCard: FC<PaymentSuccessLayoutProps> = ({ navigate }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center border dark:border-slate-700">
    <SuccessIcon />
    <SuccessCopy />
    <SuccessActions navigate={navigate} />
  </div>
);

const SuccessIcon = () => (
  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
    <CheckCircle2 size={40} />
  </div>
);

const SuccessCopy = () => (
  <>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pembayaran Berhasil!</h1>
    <p className="text-gray-600 dark:text-gray-400 mb-8">Terima kasih. Transaksi Anda telah berhasil diproses dan status pesanan Anda telah diperbarui.</p>
  </>
);

const SuccessActions: FC<PaymentSuccessLayoutProps> = ({ navigate }) => (
  <div className="flex flex-col gap-3">
    <SuccessActionButton label="Lihat Pesanan Saya" onClick={() => navigate('/orders')} primary />
    <SuccessActionButton label="Kembali ke Beranda" onClick={() => navigate('/')} />
  </div>
);

const SuccessActionButton: FC<SuccessActionButtonProps> = ({ label, onClick, primary }) => (
  <button onClick={onClick} className={primary ? primaryButtonClass : secondaryButtonClass}>{label}</button>
);

const primaryButtonClass = 'w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition';
const secondaryButtonClass = 'w-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition';

interface PaymentSuccessLayoutProps {
  navigate: ReturnType<typeof useNavigate>;
}

interface SuccessActionButtonProps {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export default PaymentSuccessPage;
