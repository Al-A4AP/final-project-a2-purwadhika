import type { FC } from "react";
import { MessageSquare } from "lucide-react";

export const EmptyReviews: FC = () => (
  <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700"><MessageSquare size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" /><p className="text-gray-500 font-medium">Belum ada ulasan yang masuk</p></div>
);
