import type { FC } from "react";

export const ReviewsSkeleton: FC = () => (
  <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-10 dark:bg-slate-900 pb-24">
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="h-12 w-64 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
      <div className="h-6 w-96 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex gap-4">
              <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-24 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>
            <div className="h-16 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
