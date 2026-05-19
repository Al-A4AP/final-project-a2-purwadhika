import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

// pake auto verify dulu buat dev skrng
const VerifyEmailPage: FC = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    // akun sudah terverfiks otomatis saat register
    // Halaman buat landing jk user klik link email
    const timer = setTimeout(() => setStatus('success'), 1000);
    return () => clearTimeout(timer);
  }, [token]);

  return (
    <div className="text-center">
      {status === 'loading' && (
        <>
          <Loader2 size={48} className="animate-spin text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Memverifikasi email...</h2>
        </>
      )}
      {status === 'success' && (
        <>
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email Terverifikasi!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Akun Anda sudah aktif dan siap digunakan.</p>
          <Link to="/auth/login" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
            Masuk Sekarang
          </Link>
        </>
      )}
      {status === 'error' && (
        <>
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verifikasi Gagal</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Link tidak valid atau sudah kadaluarsa.</p>
          <Link to="/auth/login" className="text-red-600 hover:underline">Kembali ke Login</Link>
        </>
      )}
    </div>
  );
};

export default VerifyEmailPage;
