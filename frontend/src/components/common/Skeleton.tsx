import type { FC } from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`bg-gray-200 dark:bg-slate-700 animate-pulse rounded-lg ${className}`} />
  );
};

export const PropertyCardSkeleton: FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col h-full">
      <Skeleton className="w-full aspect-4/3 rounded-none" />
      <div className="p-4 flex flex-col grow space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-between items-end">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
    </div>
  );
};
