import type { FC } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  isLoading = false,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-slate-800 pt-6 mt-6">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Halaman <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> dari <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
        {totalItems !== undefined && (
          <span> (Total: <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> data)</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 transition-colors"
        >
          <ChevronLeft size={16} />
          Sebelumnya
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 transition-colors"
        >
          Selanjutnya
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
