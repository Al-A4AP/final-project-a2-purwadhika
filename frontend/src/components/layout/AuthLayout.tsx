import type { FC, ReactNode } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ScrollToTop } from './ScrollToTop';

const AuthLayout: FC = () => (
  <AuthShell>
    <AuthBrand />
    <AuthCard />
  </AuthShell>
);

const AuthShell: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-red-50 to-blue-50 p-4 dark:from-slate-900 dark:to-slate-800">
    <ScrollToTop />
    <div className="w-full max-w-md">{children}</div>
  </div>
);

const AuthBrand: FC = () => (
  <div className="mb-8 text-center">
    <Link to="/" className="text-2xl font-bold text-red-600">
      <span className="font-black text-rose-600">PURWA</span><span className="font-black text-slate-900 dark:text-white">LOKA</span>
    </Link>
    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Temukan akomodasi terbaik untuk kebutuhan Anda</p>
  </div>
);

const AuthCard: FC = () => (
  <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-slate-800">
    <Outlet />
  </div>
);

export default AuthLayout;
