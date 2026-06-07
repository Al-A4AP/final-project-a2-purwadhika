import type { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useVerifyEmailChangeStatus, type VerificationStatus } from '@/hooks/auth/verify-email-change/useVerifyEmailChangeStatus';

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

export default VerifyEmailChangePage;
