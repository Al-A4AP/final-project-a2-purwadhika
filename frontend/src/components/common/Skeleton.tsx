import type { FC } from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`bg-slate-200/60 dark:bg-slate-700/60 animate-pulse rounded-xl ${className}`} />
  );
};

const PropertyTagsSkeleton: FC = () => (
  <div className="mt-2 flex gap-2">
    <Skeleton className="h-6 w-16 rounded-full" />
    <Skeleton className="h-6 w-16 rounded-full" />
  </div>
);

const PropertyFooterSkeleton: FC = () => (
  <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4 dark:border-slate-700">
    <Skeleton className="h-5 w-1/3" />
    <Skeleton className="h-6 w-1/3" />
  </div>
);

const PropertyCardSkeletonContent: FC = () => (
  <div className="flex grow flex-col space-y-3 p-4">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <PropertyTagsSkeleton />
    <PropertyFooterSkeleton />
  </div>
);

export const PropertyCardSkeleton: FC = () => (
  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md shadow-sm transition-shadow dark:border-slate-800 dark:bg-slate-900/80">
    <Skeleton className="aspect-4/3 w-full rounded-none" />
    <PropertyCardSkeletonContent />
  </div>
);
