import type { FC } from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from './Skeleton';

export type RouteLoadingVariant = 'page' | 'tenant' | 'auth';

interface RouteLoadingProps {
  text?: string;
  variant?: RouteLoadingVariant;
}

export const RouteLoading: FC<RouteLoadingProps> = ({ text = 'Memuat halaman...', variant = 'page' }) => (
  <section className={routeClass(variant)} aria-live="polite" aria-busy="true">
    <div className="flex items-center gap-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
      <Loader2 size={18} className="animate-spin text-red-600" />
      <span>{text}</span>
    </div>
    <RouteLoadingSkeleton variant={variant} />
  </section>
);

const routeClass = (variant: RouteLoadingVariant) =>
  variant === 'auth'
    ? 'min-h-[22rem] space-y-5'
    : `${variant === 'tenant' ? 'p-6 md:p-8' : 'mx-auto max-w-7xl px-4 py-12'} min-h-[calc(100vh-10rem)] space-y-6`;

const RouteLoadingSkeleton: FC<{ variant: RouteLoadingVariant }> = ({ variant }) => {
  if (variant === 'auth') return <AuthRouteSkeleton />;
  if (variant === 'tenant') return <TenantRouteSkeleton />;
  return <PublicRouteSkeleton />;
};

const AuthRouteSkeleton: FC = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-11 w-full" />
  </div>
);

const TenantRouteSkeleton: FC = () => (
  <div className="space-y-5">
    <Skeleton className="h-10 w-64 max-w-full" />
    <div className="grid gap-4 md:grid-cols-3">{[1, 2, 3].map((item) => <Skeleton key={item} className="h-28" />)}</div>
    <Skeleton className="h-72 w-full" />
  </div>
);

const PublicRouteSkeleton: FC = () => (
  <div className="space-y-6">
    <Skeleton className="h-12 w-80 max-w-full" />
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-72" />)}</div>
  </div>
);
