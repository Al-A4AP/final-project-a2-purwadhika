import type { FC } from "react";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";

export const RegisterSuccessPanel: FC<{ email: string }> = ({ email }) => (
  <div className="text-center py-6">
    <div className="w-16 h-16 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200 dark:border-green-800">
      <MailCheck size={32} />
    </div>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Registrasi Sukses!</h2>
    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 max-w-sm mx-auto">Email verifikasi telah dikirim ke <span className="font-semibold text-gray-900 dark:text-white">{email}</span>. Silakan periksa kotak masuk email Anda untuk melakukan verifikasi dan mengatur password Anda.</p>
    <Link to="/auth/login" className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition">Ke Halaman Login</Link>
  </div>
);
