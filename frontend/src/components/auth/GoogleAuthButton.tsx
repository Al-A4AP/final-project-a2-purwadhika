import type { FC } from 'react';

interface GoogleAuthButtonProps {
  label: string;
  onClick: () => void;
}

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.28 1 3.28 3.73 1.34 7.73l3.87 3a7.16 7.16 0 0 1 6.79-5.69z" />
    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44a5.51 5.51 0 0 1-2.39 3.62l3.71 2.87c2.17-2 3.43-4.94 3.43-8.59z" />
    <path fill="#FBBC05" d="M5.21 14.73A7.13 7.13 0 0 1 4.8 12c0-.96.16-1.9.41-2.73L1.34 6.27A11.96 11.96 0 0 0 0 12c0 2.12.55 4.12 1.5 5.88l3.71-3.15z" />
    <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.71-2.87c-1.03.69-2.35 1.1-4.25 1.1-3.69 0-6.8-2.49-7.91-5.83l-3.87 3A11.97 11.97 0 0 0 12 23z" />
  </svg>
);

export const GoogleAuthButton: FC<GoogleAuthButtonProps> = ({ label, onClick }) => (
  <button type="button" onClick={onClick} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700">
    <GoogleIcon />
    {label}
  </button>
);
