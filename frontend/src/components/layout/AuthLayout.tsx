import type { FC } from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-red-600">
            <span className="text-rose-600 font-black">PURWA</span><span className="text-slate-900 dark:text-white font-black">LOKA</span>
          </Link>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            Temukan akomodasi terbaik untuk kebutuhan Anda
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
