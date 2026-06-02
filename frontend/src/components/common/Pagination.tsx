import type { FC, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination: FC<PaginationProps> = (props) => {
  if (props.totalPages <= 1) return null;
  return (
    <PaginationShell>
      <PageSummary {...props} />
      <PaginationActions {...props} />
    </PaginationShell>
  );
};

const PaginationShell: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-slate-800 pt-6 mt-6">
    {children}
  </div>
);

const PageSummary: FC<PaginationProps> = ({ currentPage, totalPages, totalItems }) => (
  <div className="text-sm text-gray-500 dark:text-gray-400">
    Halaman <StrongText>{currentPage}</StrongText> dari <StrongText>{totalPages}</StrongText>
    {totalItems !== undefined && <span> (Total: <StrongText>{totalItems}</StrongText> data)</span>}
  </div>
);

const PaginationActions: FC<PaginationProps> = (props) => (
  <div className="flex items-center gap-2">
    <PageButton direction="prev" disabled={props.currentPage === 1 || props.isLoading} onClick={() => props.onPageChange(props.currentPage - 1)} />
    <PageButton direction="next" disabled={props.currentPage === props.totalPages || props.isLoading} onClick={() => props.onPageChange(props.currentPage + 1)} />
  </div>
);

const PageButton: FC<PageButtonProps> = ({ direction, disabled, onClick }) => (
  <button onClick={onClick} disabled={disabled} title={getButtonLabel(direction)} aria-label={getButtonLabel(direction)} className={buttonClass}>
    {direction === 'prev' && <ChevronLeft size={16} />}
    {direction === 'prev' ? 'Sebelumnya' : 'Selanjutnya'}
    {direction === 'next' && <ChevronRight size={16} />}
  </button>
);

const StrongText: FC<{ children: ReactNode }> = ({ children }) => (
  <span className="font-semibold text-gray-900 dark:text-white">{children}</span>
);

const getButtonLabel = (direction: PageDirection) =>
  direction === 'prev' ? 'Halaman sebelumnya' : 'Halaman selanjutnya';

const buttonClass = 'flex items-center gap-1 px-4 py-2 text-sm font-medium border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 transition-colors';

type PageDirection = 'prev' | 'next';

interface PageButtonProps {
  direction: PageDirection;
  disabled?: boolean;
  onClick: () => void;
}
