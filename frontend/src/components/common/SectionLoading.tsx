import type { FC } from 'react';
import { Skeleton } from './Skeleton';

type SectionLoadingVariant = 'cards' | 'table' | 'report' | 'booking';
type SectionLoadingSize = 'sm' | 'md' | 'lg';

interface SectionLoadingProps {
  className?: string;
  label?: string;
  size?: SectionLoadingSize;
  variant?: SectionLoadingVariant;
}

export const SectionLoading: FC<SectionLoadingProps> = ({ className = '', label, size = 'md', variant = 'cards' }) => (
  <section className={`${baseClass} ${sizeClass(size)} ${className}`} aria-live="polite" aria-busy="true">
    {label && <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</p>}
    <SectionLoadingBody variant={variant} />
  </section>
);

const baseClass = 'space-y-4 rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80';

const sizeClass = (size: SectionLoadingSize) => ({
  sm: 'min-h-[14rem]',
  md: 'min-h-[22rem]',
  lg: 'min-h-[34rem]',
}[size]);

const SectionLoadingBody: FC<{ variant: SectionLoadingVariant }> = ({ variant }) => {
  if (variant === 'table') return <TableLoading />;
  if (variant === 'report') return <ReportLoading />;
  if (variant === 'booking') return <BookingLoading />;
  return <CardsLoading />;
};

const CardsLoading: FC = () => (
  <div className="space-y-4">{[1, 2, 3].map((item) => <Skeleton key={item} className="h-24 w-full" />)}</div>
);

const TableLoading: FC = () => (
  <div className="space-y-3">{[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-14 w-full" />)}</div>
);

const ReportLoading: FC = () => (
  <div className="space-y-5">
    <div className="grid gap-4 md:grid-cols-3">{[1, 2, 3].map((item) => <Skeleton key={item} className="h-28" />)}</div>
    <Skeleton className="h-72 w-full" />
  </div>
);

const BookingLoading: FC = () => (
  <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
    <Skeleton className="h-96 w-full" />
    <Skeleton className="h-80 w-full" />
  </div>
);
