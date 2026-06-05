import type { FC } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PaymentSuccessPage: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id') || 'Sistem akan segera memproses';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderId);
    toast.success('Nomor pesanan disalin!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 pb-16 pt-24">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 max-w-md w-full border border-slate-100 dark:border-slate-800">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Reservasi Berhasil!</h1>
          <p className="text-slate-600 dark:text-slate-400">Terima kasih telah memesan melalui PURWALOKA. Pesanan Anda telah diterima dan sedang diproses.</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 mb-8 border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 font-medium">Nomor Pesanan</p>
          <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-mono text-slate-900 dark:text-white font-bold tracking-wider">{orderId.length > 20 ? orderId.substring(0, 18) + '...' : orderId}</span>
            <button onClick={copyToClipboard} className="text-slate-400 hover:text-red-600 transition-colors" title="Salin nomor pesanan">
              <Copy size={18} />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            Silakan periksa halaman Riwayat Pesanan untuk memantau status pesanan, melihat detail tagihan, atau mengunggah bukti pembayaran jika Anda menggunakan transfer manual.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate('/orders')} 
            className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition shadow-sm"
          >
            Lihat Riwayat Pesanan
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-4 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
