import type { FC } from 'react';
import { ShieldAlert } from 'lucide-react';

interface BookingAccessNoticeProps {
  message?: string;
}

export const BookingAccessNotice: FC<BookingAccessNoticeProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-900/20 dark:text-amber-200">
      <ShieldAlert size={18} className="mt-0.5 shrink-0" />
      <p>{message}</p>
    </div>
  );
};
