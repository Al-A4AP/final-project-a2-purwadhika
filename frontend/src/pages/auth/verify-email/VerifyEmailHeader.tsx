import type { FC } from "react";
import { KeyRound } from "lucide-react";

export const VerifyEmailHeader: FC = () => (
  <div className="text-center mb-6">
    <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-3">
      <KeyRound size={24} />
    </div>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Buat Password Anda</h2>
    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
      Atur password Anda untuk mengaktifkan akun <BrandName /> Anda.
    </p>
  </div>
);

const BrandName: FC = () => <><span className="text-rose-600 font-bold">PURWA</span><span className="text-slate-900 dark:text-white font-bold">LOKA</span></>;
