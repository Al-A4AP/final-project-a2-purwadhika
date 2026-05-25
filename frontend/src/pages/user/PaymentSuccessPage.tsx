import type { FC } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PaymentSuccessPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Tampilkan notifikasi sukses saat halaman dimuat
    toast.success('Pembayaran Berhasil diproses!');
    
    // Redirect ke halaman pesanan setelah 3 detik
    const timer = setTimeout(() => {
      navigate('/orders');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center border dark:border-slate-700">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pembayaran Berhasil!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Terima kasih. Transaksi Anda telah berhasil diproses dan status pesanan Anda telah diperbarui.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/orders')}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
          >
            Lihat Pesanan Saya
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
