import type { FC } from "react";
import { MessageSquare } from "lucide-react";

export const ReviewsHeader: FC = () => (
  <><div className="flex items-center gap-3"><MessageSquare className="text-red-600" size={28} /><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ulasan Tamu</h1></div><p className="text-sm text-gray-500">Lihat ulasan dari tamu dan berikan balasan yang profesional untuk membangun reputasi properti Anda.</p></>
);
