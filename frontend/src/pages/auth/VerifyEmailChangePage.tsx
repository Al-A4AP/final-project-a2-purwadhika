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
  const verification = useVerifyEmailChangeStatus(token);

  return (
    <div className="max-w-md mx-auto py-8 text-center">
      <StatusIcon status={verification.status} />
      <VerificationTitle status={verification.status} />
      <p className="text-gray-600 dark:text-gray-400 mb-6">{verification.message}</p>
      <LoginLink status={verification.status} />
    </div>
  );
};

const useVerifyEmailChangeStatus = (token?: string) => {
  const [state, setState] = useState(() => getInitialState(token));
  useEffect(() => verifyEmailChangeToken(token, setState), [token]);
  return state;
};

const verifyEmailChangeToken = (token: string | undefined, setState: SetVerificationState) => {
  if (!token) return;
  authService.verifyEmailChange(token)
    .then(() => setState({ status: 'success', message: 'Email baru berhasil diverifikasi.' }))
    .catch((err) => setState({ status: 'error', message: getErrorMessage(err) }));
};

const getInitialState = (token?: string): VerificationState =>
  token ? { status: 'loading', message: 'Memproses verifikasi email baru...' } : { status: 'error', message: 'Token verifikasi tidak ditemukan.' };

const StatusIcon: FC<{ status: VerificationStatus }> = ({ status }) => {
  if (status === 'loading') return <Loader2 size={48} className="animate-spin text-red-600 mx-auto mb-4" />;
  if (status === 'success') return <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />;
  return <XCircle size={48} className="text-red-500 mx-auto mb-4" />;
};

const VerificationTitle: FC<{ status: VerificationStatus }> = ({ status }) => (
  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
    {status === 'success' ? 'Email Diperbarui' : 'Verifikasi Email Baru'}
  </h2>
);

const LoginLink: FC<{ status: VerificationStatus }> = ({ status }) =>
  status !== 'loading' ? (
    <Link to="/auth/login" className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition">
      Kembali ke Login
    </Link>
  ) : null;

type VerificationStatus = 'loading' | 'success' | 'error';
type VerificationState = { status: VerificationStatus; message: string };
type SetVerificationState = (state: VerificationState) => void;

export default VerifyEmailChangePage;
