import type { FC } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import type { VerifyEmailPageState } from "@/hooks/auth/verify-email/verifyEmailTypes";

export const LoadingPanel: FC = () => (
  <div className="text-center py-8"><Loader2 size={48} className="animate-spin text-red-600 mx-auto mb-4" /><h2 className="text-xl font-bold text-gray-900 dark:text-white">Memproses verifikasi...</h2></div>
);

export const SuccessPanel: FC = () => (
  <div className="text-center py-6"><CheckCircle size={48} className="text-green-500 mx-auto mb-4" /><h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email Terverifikasi!</h2><p className="text-gray-600 dark:text-gray-400 mb-6">Akun Anda sudah aktif dan siap digunakan. Silakan login untuk masuk ke aplikasi.</p><Link to="/auth/login" className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition">Masuk Sekarang</Link></div>
);

export const ErrorPanel: FC<{ state: VerifyEmailPageState }> = ({ state }) => (
  <div className="text-center py-6"><XCircle size={48} className="text-red-500 mx-auto mb-4" /><h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verifikasi Gagal</h2><p className="text-gray-600 dark:text-gray-400 mb-6">{state.errorMessage || "Token tidak valid, sudah kadaluarsa, atau sudah pernah digunakan."}</p><div className="space-y-3"><button onClick={state.retry} className="inline-block text-red-600 font-semibold hover:underline bg-transparent border-none outline-none cursor-pointer">Coba Lagi</button><div><Link to="/auth/login" className="text-gray-500 hover:text-gray-700 text-sm">Kembali ke Login</Link></div></div></div>
);
