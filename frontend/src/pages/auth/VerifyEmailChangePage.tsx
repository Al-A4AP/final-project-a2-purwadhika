import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/errorMessage';
import { authService } from '@/services/authService';

const getErrorMessage = (err: unknown) =>
  getApiErrorMessage(err, 'Verifikasi email baru gagal');

const VerifyEmailChangePage: FC = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(token ? 'loading' : 'error');
  const [message, setMessage] = useState(
    token ? 'Memproses verifikasi email baru...' : 'Token verifikasi tidak ditemukan.',
  );

  useEffect(() => {
    if (!token) return;
    authService.verifyEmailChange(token)
      .then(() => {
        setStatus('success');
        setMessage('Email baru berhasil diverifikasi.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(getErrorMessage(err));
      });
  }, [token]);

  return (
    <div className="max-w-md mx-auto py-8 text-center">
      {status === 'loading' && <Loader2 size={48} className="animate-spin text-red-600 mx-auto mb-4" />}
      {status === 'success' && <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />}
      {status === 'error' && <XCircle size={48} className="text-red-500 mx-auto mb-4" />}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {status === 'success' ? 'Email Diperbarui' : 'Verifikasi Email Baru'}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
      {status !== 'loading' && (
        <Link
          to="/auth/login"
          className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Kembali ke Login
        </Link>
      )}
    </div>
  );
};

export default VerifyEmailChangePage;
