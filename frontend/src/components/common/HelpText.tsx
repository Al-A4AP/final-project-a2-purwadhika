import type { FC, ReactNode } from "react";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";

interface HelpTextProps {
  children: ReactNode;
  className?: string;
  link?: { label: string; to: string };
  title?: string;
}

export const HelpText: FC<HelpTextProps> = ({ children, className = "", link, title }) => (
  <div className={`flex gap-3 rounded-lg border border-sky-100 bg-sky-50 px-4 py-3 text-sky-800 dark:border-sky-900/50 dark:bg-sky-900/20 dark:text-sky-100 ${className}`}>
    <Info className="mt-0.5 shrink-0" size={16} />
    <div className="min-w-0 text-xs leading-relaxed">
      {title && <p className="mb-0.5 font-semibold">{title}</p>}
      <p>{children}{link && <Link to={link.to} className="ml-1 font-semibold underline underline-offset-2">{link.label}</Link>}</p>
    </div>
  </div>
);
