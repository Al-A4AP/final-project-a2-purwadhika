import type { FC } from "react";
import { CheckCircle } from "lucide-react";

export const ResetPasswordSuccessPanel: FC = () => (
  <div className="text-center">
    <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
    <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Password Berhasil Direset!</h2>
    <p className="text-gray-600 dark:text-gray-400">Mengalihkan ke halaman login...</p>
  </div>
);
