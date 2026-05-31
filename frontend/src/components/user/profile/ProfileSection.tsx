import type { FC, ReactNode } from "react";

export const ProfileSection: FC<{ children: ReactNode; className?: string; title?: string }> = ({ children, className = "", title }) => (
  <section className={`rounded-xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}>
    {title && <h2 className="mb-5 font-semibold text-gray-900 dark:text-white">{title}</h2>}
    {children}
  </section>
);
