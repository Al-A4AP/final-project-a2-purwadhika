import type { FC } from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const ForgotPasswordSuccessPanel: FC = () => (
  <div className="text-center">
    <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
    <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Email Dikirim!</h2>
    <p className="mb-6 text-gray-600 dark:text-gray-400">Jika email terdaftar, link reset password akan dikirim. Cek inbox Anda.</p>
    <Link to="/auth/login" className="text-red-600 hover:underline">Kembali ke Login</Link>
  </div>
);
